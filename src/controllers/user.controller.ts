import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { IUser } from '../interfaces/user';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, location, photo, phone } = req.body;

    const db = await connectDB();
    const usersCollection = db.collection<IUser>('user'); 

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ success: true, message: 'User already exists', user: existingUser });
    }

    
    const newUser: IUser = {
      name,
      email,
      role: role || 'recipient',
      location,
      photo: photo || '',
      phone: phone || '',
      status: 'active',
      createdAt: new Date(),
    };

    
    const result = await usersCollection.insertOne(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully! 🎉',
      insertedId: result.insertedId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};