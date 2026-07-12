import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const client = new MongoClient(uri);

let db: Db;

export const connectDB = async (): Promise<Db> => {
  if (db) return db;

  try {
    await client.connect();
    console.log('🍃 [database]: MongoDB Atlas Connected Successfully!');
    
    db = client.db('food-link-db'); 
    
    return db;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1); 
  }
};