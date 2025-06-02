import express from 'express';
import {MongoClient} from 'mongodb';
import {uri} from './dbconnection.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const client = new MongoClient(uri);
const db = client.db("Heftly");
const UserCollection = db.collection("users");

router.get("/", async (req, res) => {
    try {
        const users = await UserCollection.find().toArray();

        console.log(users);

        res.json(users);
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzer:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

export default router;