import cors from 'cors';
import express from "express";
import { connectDB } from "./backend/dbconnection.js";
import loginRouter from './backend/login.js';
import userRouter from './backend/user.js';


const app = express();
const PORT = 5000;


const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST','DELETE', 'PATCH', 'PUT'],
    allowedHeaders: '*',
};

app.use(cors(corsOptions))

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

await connectDB();

app.use('/login', loginRouter);
app.use('/user', userRouter);


