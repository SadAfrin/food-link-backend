import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { connectDB } from '../config/db';
import { ObjectId, Filter } from 'mongodb';

export const getMerchantAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { merchantId } = req.params;
    const db = await connectDB();
    
    const foodCollection = db.collection('food_items');
    const requestCollection = db.collection('food_requests');

    // Cast the filter explicitly to resolve TS2769 overload issues
    const baseFilter = { merchantId: new ObjectId(merchantId) } as Filter<any>;

    // 1. Count total food items listed by this merchant
    const totalListed = await foodCollection.countDocuments(baseFilter);

    // 2. Count active/available food donations
    const activeFilter = { 
      merchantId: new ObjectId(merchantId), 
      status: 'available' 
    } as Filter<any>;
    
    const activeDonations = await foodCollection.countDocuments(activeFilter);

    // 3. Aggregate request statistics grouped by their status
    const requestStats = await requestCollection.aggregate([
      { $match: { merchantId: new ObjectId(merchantId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();

    // Format the aggregation array into a clean object
    const requests = { pending: 0, approved: 0, delivered: 0, cancelled: 0 };
    requestStats.forEach((stat: any) => {
      if (stat._id in requests) {
        requests[stat._id as keyof typeof requests] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalFoodItemsListed: totalListed,
        activeDonationsCount: activeDonations,
        requestsSummary: requests
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRecipientAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientId } = req.params;
    const db = await connectDB();
    const requestCollection = db.collection('food_requests');

    // Aggregate request history metrics for the recipient
    const recipientStats = await requestCollection.aggregate([
      { $match: { recipientId: new ObjectId(recipientId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();

    const stats = { totalRequested: 0, pending: 0, approved: 0, delivered: 0, cancelled: 0 };
    
    recipientStats.forEach((stat: any) => {
      if (stat._id in stats) {
        stats[stat._id as keyof typeof stats] = stat.count;
        stats.totalRequested += stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};