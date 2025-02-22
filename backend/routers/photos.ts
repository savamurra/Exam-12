import express from "express";
import { Photo } from "../models/Photo";
import { imagesUpload } from "../multer";
import auth, { RequestWithUser } from "../middleware/auth";
import { IPhoto } from "../types";
import { Error } from "mongoose";
import permit from "../middleware/permit";

export const photoRouter = express.Router();

photoRouter.get("/", async (req, res, next) => {
  const userId = req.query.user as string;

  try {
    if (userId) {
      const result = await Photo.find({ user: userId }).populate(
        "user",
        "_id displayName",
      );
      if (!result) {
        res.status(404).send({ error: "No photo found" });
      } else {
        res.status(200).send(result);
      }
    } else {
      const result = await Photo.find().populate("user", "_id displayName");
      if (!result) {
        res.status(404).send({ error: "No photo found" });
      } else {
        res.status(200).send(result);
      }
    }
  } catch (e) {
    next(e);
  }
});

photoRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Photo.findById(id);
    if (!result) {
      res.status(404).send({ error: "No photo found" });
      return;
    }
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

photoRouter.post(
  "/",
  imagesUpload.single("image"),
  auth,
  async (req, res, next) => {
    const expressReq = req as RequestWithUser;

    const user = expressReq.user;

    const newPhoto: IPhoto = {
      user: user._id.toString(),
      title: req.body.title,
      image: req.file ? "images" + req.file.filename : null,
    };
    try {
      const photo = new Photo(newPhoto);
      await photo.save();
      res.send(photo);
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        res.status(400).send(e);
        return;
      }
    }
  },
);

photoRouter.delete(
  "/:id",
  auth,
  permit("admin", "user"),
  async (req, res, next) => {
    const expressReq = req as RequestWithUser;

    const user = expressReq.user;

    const id = req.params.id;

    try {
      const currentPhoto = await Photo.findById(id);
      if (!currentPhoto) {
        res.status(404).send({ error: "Photo not found" });
        return;
      }
      if (user.role === "admin") {
        const photo = await Photo.findByIdAndDelete(id);
        res.send({ message: "Photo deleted successfully.", photo });
      } else if (user.role === "user") {
        if (currentPhoto) {
          if (currentPhoto.user.toString() !== user._id.toString()) {
            res
              .status(403)
              .send({ error: "You can not delete someone else's photo" });
            return;
          } else {
            const photo = await Photo.findByIdAndDelete(id);
            res.send({ message: "Track deleted successfully.", photo });
          }
        }
      }
    } catch (e) {
      next(e);
    }
  },
);
