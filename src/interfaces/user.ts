import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  role: 'merchant' | 'recipient';
  location: string;
  photo?: string;
  phone?: string;
  status: 'active' | 'blocked';
  createdAt: Date;
}