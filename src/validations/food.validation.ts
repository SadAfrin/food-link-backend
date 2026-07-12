import { z } from 'zod';

export const addFoodItemSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3, 'Title must be at least 3 characters long'),
    quantity: z.string({ required_error: 'Quantity description is required' }),
    expiryDate: z.string({ required_error: 'Expiry date is required' }).refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    notes: z.string().optional(),
    merchantId: z.string({ required_error: 'Merchant ID is required' }).min(24, 'Invalid MongoDB ObjectId length'),
  }),
});