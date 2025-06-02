import express from 'express';
import {MongoClient, ObjectId} from 'mongodb';
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

        res.json(users);
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzer:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await UserCollection.deleteOne({ id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Benutzer nicht gefunden" });
        }

        res.json({ message: "Benutzer gelöscht" });
    } catch (error) {
        console.error("Fehler beim Löschen des Benutzers:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});


export default router;