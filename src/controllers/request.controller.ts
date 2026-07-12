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

export const getMerchantRequests = async (req: Request, res: Response) => {
  try {
    const { merchantId } = req.params;
    const db = await connectDB();
    const requestCollection = db.collection<IFoodRequest>('food_requests');

    const requests = await requestCollection
      .find({ merchantId: new ObjectId(merchantId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'approved' | 'delivered' | 'cancelled'

    if (!['approved', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update.' });
    }

    const db = await connectDB();
    const requestCollection = db.collection<IFoodRequest>('food_requests');
    const foodCollection = db.collection<IFoodItem>('food_items');

    const foodRequest = await requestCollection.findOne({ _id: new ObjectId(requestId) });

    if (!foodRequest) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    await requestCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status } }
    );

    if (status === 'cancelled') {
      await foodCollection.updateOne(
        { _id: foodRequest.foodItemId },
        { $set: { status: 'available' } }
      );
    } else if (status === 'delivered') {
      await foodCollection.updateOne(
        { _id: foodRequest.foodItemId },
        { $set: { status: 'delivered' } }
      );
    }

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status} successfully! 🔄`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};