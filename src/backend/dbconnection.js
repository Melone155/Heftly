import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const DB_User = process.env.DB_User;
const DB_Password = process.env.DB_Password;
const DB_IPaddress = process.env.DB_IPaddress;
const DB_Database = process.env.DB_Database;

export const uri = `mongodb://${DB_User}:${DB_Password}@${DB_IPaddress}:27017/?authMechanism=DEFAULT`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

export async function connectDB() {
    try {
        await client.connect();
        db = client.db(DB_Database);

        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        if (!collectionNames.includes("users")) {
            await db.createCollection("users");
        }

        console.log("Verbindung zu MongoDB erfolgreich");
    } catch (error) {
        console.error("Fehler bei der Verbindung zu MongoDB:", error);
        process.exit(1);
    }
}