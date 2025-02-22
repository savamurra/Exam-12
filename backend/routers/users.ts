import express from "express";
import { Error } from "mongoose";
import User from "../models/User";
import auth, { RequestWithUser } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";
import config from "../config";
import { imagesUpload } from "../multer";

const userRouter = express.Router();

const client = new OAuth2Client(config.google.clientId);

userRouter.post("/google", async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res
        .status(400)
        .send({ error: "Invalid credential. Google login error!" });
      return;
    }

    const email = payload.email;
    const id = payload.sub;
    const displayName = payload.name;
    const avatar = payload.picture;

    if (!email) {
      res.status(400).send({ error: "No enough data from Google" });
      return;
    }

    if (!displayName) {
      res.status(400).send({ error: "No enough displayName from Google" });
      return;
    }

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({
        email: email,
        password: crypto.randomUUID(),
        googleId: id,
        avatar: avatar,
        displayName: displayName,
      });
    }

    user.generateToken();
    await user.save();
    res.send({ message: "Login with Google success.", user });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
      return;
    }

    next(error);
  }
});

userRouter.post(
  "/register",
  imagesUpload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password,
        role: req.body.role,
        avatar: req.file ? "images" + req.file.filename : null,
      });

      user.generateToken();

      await user.save();
      res.send({ user });
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        res.status(400).send(error);
        return;
      }

      next(error);
    }
  },
);

userRouter.post("/sessions", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send({ error: "Email not found" });
      return;
    }

    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
      res.status(400).send({ error: "Password is  wrong" });
      return;
    }

    user.generateToken();
    await user.save();

    res.send({ message: "Username and password is correct", user });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
      return;
    }
  }
});

userRouter.delete("/sessions", auth, async (req, res, next) => {
  const userFromAuth = (req as RequestWithUser).user;

  try {
    const user = await User.findOne({ _id: userFromAuth._id });
    if (user) {
      user.generateToken();
      await user.save();
      res.send({ message: "User logout successfully." });
    }
  } catch (e) {
    next(e);
  }
});

export default userRouter;
