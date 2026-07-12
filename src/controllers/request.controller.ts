import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { IFoodRequest } from '../interfaces/request';
import { IFoodItem } from '../interfaces/food';
import { ObjectId } from 'mongodb';

export const createFoodRequest = async (req: Request, res: Response) => {
  try {
    const { foodItemId, recipientId, merchantId, notes } = req.body;

    const db = await connectDB();
    const foodCollection = db.collection<IFoodItem>('food_items');
    const requestCollection = db.collection<IFoodRequest>('food_requests');

    const foodItem = await foodCollection.findOne({ _id: new ObjectId(foodItemId) });

    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    if (foodItem.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Food item is no longer available.' });
    }

    const newRequest: IFoodRequest = {
      foodItemId: new ObjectId(foodItemId),
      recipientId: new ObjectId(recipientId),
      merchantId: new ObjectId(merchantId),
      status: 'pending',
      notes: notes || '',
      createdAt: new Date(),
    };

    const result = await requestCollection.insertOne(newRequest);

    await foodCollection.updateOne(
      { _id: new ObjectId(foodItemId) },
      { $set: { status: 'requested' } }
    );

    res.status(201).json({
      success: true,
      message: 'Food request submitted successfully! 📦',
      insertedId: result.insertedId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};