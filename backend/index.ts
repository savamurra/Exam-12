import express from "express";
import mongoose from "mongoose";

import userRouter from "./routers/users";
import mongoDb from "./mongoDb";
import {photoRouter} from "./routers/photos";

const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use('/photo', photoRouter);

const run = async () => {
    await mongoose.connect("mongodb://localhost/exam-12");

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });

    process.on("exit", () => {
        mongoDb.disconnect();
    });
};

run().catch((err) => console.log(err));
