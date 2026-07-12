import { z } from 'zod';

export const createFoodRequestSchema = z.object({
  body: z.object({
    foodItemId: z.string({ required_error: 'Food item ID is required' }).min(24, 'Invalid MongoDB ObjectId length'),
    recipientId: z.string({ required_error: 'Recipient ID is required' }).min(24, 'Invalid MongoDB ObjectId length'),
    merchantId: z.string({ required_error: 'Merchant ID is required' }).min(24, 'Invalid MongoDB ObjectId length'),
    additionalNotes: z.string().optional(),
  }),
});