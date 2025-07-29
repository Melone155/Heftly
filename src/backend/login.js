import express from 'express';
import { MongoClient } from 'mongodb';
import { uri } from './dbconnection.js';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const DB_Database = process.env.DB_Database;
const Encrypt_SECRET = process.env.ENCRYPT_SECRET;

const router = express.Router();
const client = new MongoClient(uri);
const db = client.db(DB_Database);
const users = db.collection("users");

router.get('/', async (req, res) => {
    const username = req.headers['username'];
    const password = req.headers['password'];

    try {
        const user = await users.findOne({ "name": username });
        if (!user) {
            return res.status(404).json({ error: "INVALID_DATA" });
        }

        const userData = {
            customerId: user._id,
            password: user.password,
            role: user.role,
            date: user.createdAt,
        };

        const secretKey = crypto.createHash('sha256').update(Encrypt_SECRET).digest();

        function encrypt(text) {
            const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null); // IV = null
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }

        if (encrypt(password) !== userData.password) {
            return res.status(404).json({ error: "INVALID_DATA" });
        }

        const token = jwt.sign(
            {
                customerId: userData.customerId,
                role: userData.role,
                date:userData.date,
            },
            JWT_SECRET,
            { expiresIn: '2h' } // oder z.B. '7d'
        );

        res.status(200).json({ message: "Erfolgreich eingeloggt", token: token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfehler" });
    } finally {
        await client.close();
    }
});

export default router;
