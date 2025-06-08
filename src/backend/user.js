import express from 'express';
import {MongoClient, ObjectId} from 'mongodb';
import {uri} from './dbconnection.js';
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

const router = express.Router();
const client = new MongoClient(uri);
const db = client.db("Heftly");
const UserCollection = db.collection("users");

const Encrypt_SECRET = process.env.ENCRYPT_SECRET;

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

router.post("/create", async (req, res) => {
    try {
        const userDataRaw = req.headers["userdata"];

        if (!userDataRaw) {
            return res.status(400).json({ message: "Keine Benutzerdaten erhalten." });
        }

        let userData;

        try {
            userData = JSON.parse(userDataRaw);
        } catch (e) {
            return res.status(400).json({ message: "Ungültiges JSON-Format im Header." });
        }

        try {
            const existingUser = await UserCollection.findOne({ name: userData.name });

            if (existingUser) {
                return res.status(200).json({ exists: true });
            }

        } catch (error) {
            console.error("Fehler beim Überprüfen des Namens:", error);
            return res.status(500).json({ error: "Interner Serverfehler" });
        }

        const secretKey = crypto.createHash('sha256').update(Encrypt_SECRET).digest();

        function encrypt(text) {
            const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null); // IV = null
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }

        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;

        const result = await UserCollection.insertOne({
            id: userData.id,
            name: userData.name,
            role: userData.role,
            password: encrypt(userData.password),
            department: userData.department,
            assignedTrainer: userData.assignedTrainer || null,
            createdAt: formattedDate,
        });

        res.status(201).json({ message: "Benutzer erstellt", newUser: { _id: result.insertedId, ...userData } });

    } catch (error) {
        console.error("Fehler beim Erstellen des Benutzers:", error);
        res.status(500).json({ message: "Interner Serverfehler" });
    }
});

router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    try {
        const result = await UserCollection.updateOne(
            { id: userId },
            { $set: updatedUser }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Benutzer nicht gefunden" });
        }

        res.json({ message: "Benutzer aktualisiert" });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Benutzers:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

export default router;