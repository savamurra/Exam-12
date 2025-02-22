import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import { randomUUID } from "node:crypto";
import {Photo} from "./models/Photo";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection("users");
        await db.dropCollection("photos");
    } catch (e) {
        console.error(e);
    }

    const [firstUser, secondUser] = await User.create(
        {
            email: "jaime@gmail.com",
            displayName: "Jaime",
            password: "123",
            token: randomUUID(),
            role: "user",
            avatar: "fixtures/jaime.jpg",
        },
        {
            email: "bes@gmail.com",
            displayName: "Tyrion",
            password: "123",
            token: randomUUID(),
            role: "admin",
            avatar: "fixtures/tyrion.jpg",
        },
    );

    await Photo.create(
        {
            user: firstUser,
            title: "Wild Essence",
            image: 'fixtures/picture-1.jpg',
        },
        {
            user: firstUser,
            title: "Nature’s Whisper",
            image: 'fixtures/picture-2.jpg',
        },
        {
            user: firstUser,
            title: "Earth’s Beauty",
            image: 'fixtures/picture-3.jpg',
        },
        {
            user: secondUser,
            title: "Serene Landscapes",
            image: 'fixtures/picture-4.jpg',
        },
        {
            user: secondUser,
            title: "Pure Wilderness",
            image: 'fixtures/picture-5.jpg',
        },
        {
            user: secondUser,
            title: "Tranquil Scenes",
            image: 'fixtures/picture-6.jpg',
        }
    )

    await db.close();
};

run().catch(console.error);
