import { ObjectId } from 'mongodb';

export interface IFoodRequest {
  _id?: ObjectId;
  foodItemId: ObjectId;
  recipientId: ObjectId;
  merchantId: ObjectId;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
}