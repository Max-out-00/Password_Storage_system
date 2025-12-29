import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from 'mongodb';
import bodyParser from "body-parser";
import cors from "cors";
// const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// app.use(cors());
  app.use(cors({
        origin: 'http://localhost:5173'
    }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection Setup
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'PasswordStorage';

let db;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(dbName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Basic Route
app.get('/', async (req, res) => {
    try {
        const collection = db.collection('passwords');
        const docs = await collection.find({}).toArray();
        res.json(docs);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ error: 'Failed to fetch passwords' });
    }
});

// Start the server after connecting to the database

app.listen(port, async () => {
    await connectDB();
    console.log(`Example app listening on port http://localhost:${port}`);
});

//=------------------------------ Add Password API -----------------------------//
app.post('/add', async (req, res) => {
    try {
        const collection = db.collection('passwords');
        const result = await collection.insertOne(req.body);
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).json({ error: 'Failed to save password' });
    }
});

//=------------------------------ Deleting Password API -----------------------------//
app.post('/delete', async (req, res) => {
    try {
        const collection = db.collection('passwords');
        const result = await collection.deleteOne({ _id: new ObjectId(req.body.id) });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ error: 'Failed to delete password' });
    }
});

//=------------------------------ Fetching Passwords API -----------------------------//
app.get('/passwords', async (req, res) => {
    try {
        const collection = db.collection('passwords');
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ error: 'Failed to fetch passwords' });
    }
});
