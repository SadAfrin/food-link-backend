import { ObjectId } from 'mongodb';

export interface IFoodItem {
  _id?: ObjectId;
  title: string;
  description: string;
  quantity: string;        // e.g., "5 kg" or "10 packets"
  expiryDate: Date;
  pickupLocation: string;
  merchantId: ObjectId;     
  status: 'available' | 'requested' | 'delivered';
  imageUrl?: string;
  createdAt: Date;
}