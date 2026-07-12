const dns = require('node:dns');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Food Link Backend is Running Successfully! 🚀');
});

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`⚡ [server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
  }
};

startServer();