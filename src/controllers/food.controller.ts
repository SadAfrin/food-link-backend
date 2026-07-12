import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { IFoodItem } from '../interfaces/food';

export const addFoodItem = async (req: Request, res: Response) => {
  try {
    const { title, description, quantity, expiryDate, pickupLocation, merchantId, imageUrl } = req.body;

    const db = await connectDB();
    const foodCollection = db.collection<IFoodItem>('food_items');

    const newFoodItem: IFoodItem = {
      title,
      description,
      quantity,
      expiryDate: new Date(expiryDate),
      pickupLocation,
      merchantId,
      status: 'available',
      imageUrl: imageUrl || '',
      createdAt: new Date(),
    };

    const result = await foodCollection.insertOne(newFoodItem);

    res.status(201).json({
      success: true,
      message: 'Food item donated successfully! 🍏',
      insertedId: result.insertedId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAvailableFoodItems = async (_req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const foodCollection = db.collection<IFoodItem>('food_items');

    const foods = await foodCollection.find({ status: 'available' }).sort({ createdAt: -1 }).toArray();

    res.status(200).json({ success: true, data: foods });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};