import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Expense, { EXPENSE_CATEGORIES } from '../models/Expense.js';
import ItineraryItem from '../models/ItineraryItem.js';

/**
 * GET /api/trips/:tripId/budget
 * Protected — Calculate complete budget analytics and breakdown for a trip
 */
export const getTripBudget = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    // 1. Verify trip exists and is owned by user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or unauthorized.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Fetch all actual expenses for this trip
    const expenses = await Expense.find({ tripId: trip._id });

    // 3. Fetch all planned itinerary activities for this trip
    const itineraryItems = await ItineraryItem.find({ tripId: trip._id }).populate(
      'placeId',
      'name estimatedCost category'
    );

    // 4. Calculate actual expenses and category breakdown
    let actualExpensesTotal = 0;
    const categoryTotals = {};
    const categoryCounts = {};

    // Initialize all allowed categories with 0
    EXPENSE_CATEGORIES.forEach((cat) => {
      categoryTotals[cat] = 0;
      categoryCounts[cat] = 0;
    });

    for (const exp of expenses) {
      const amt = Number(exp.amount) || 0;
      actualExpensesTotal += amt;
      const cat = exp.category?.toLowerCase() || 'miscellaneous';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += amt;
        categoryCounts[cat] += 1;
      } else {
        categoryTotals.miscellaneous += amt;
        categoryCounts.miscellaneous += 1;
      }
    }

    actualExpensesTotal = Number(actualExpensesTotal.toFixed(2));

    // Category breakdown with percentage of actual spend
    const categoryBreakdown = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      const total = Number(categoryTotals[cat].toFixed(2));
      const percentage =
        actualExpensesTotal > 0
          ? Number(((total / actualExpensesTotal) * 100).toFixed(2))
          : 0;
      categoryBreakdown[cat] = {
        total,
        percentage,
        count: categoryCounts[cat],
      };
    });

    // 5. Calculate planned itinerary activity costs
    let plannedActivityCosts = 0;
    for (const item of itineraryItems) {
      const cost =
        item.estimatedCost !== undefined && item.estimatedCost !== null
          ? Number(item.estimatedCost)
          : Number(item.placeId?.estimatedCost) || 0;
      plannedActivityCosts += cost;
    }
    plannedActivityCosts = Number(plannedActivityCosts.toFixed(2));

    // 6. Calculate Budget Metrics
    const totalBudget = Number((trip.totalBudget || 0).toFixed(2));
    const estimatedTotal = Number((actualExpensesTotal + plannedActivityCosts).toFixed(2));
    const remainingBudget = Number((totalBudget - actualExpensesTotal).toFixed(2));
    const percentageUsed =
      totalBudget > 0 ? Number(((actualExpensesTotal / totalBudget) * 100).toFixed(2)) : 0;

    // Trip duration in days
    const startMs = new Date(trip.startDate).getTime();
    const endMs = new Date(trip.endDate).getTime();
    const tripDurationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

    const averageDailyCost = Number((actualExpensesTotal / tripDurationDays).toFixed(2));

    // Over budget detection
    const isOverBudget = totalBudget > 0 ? actualExpensesTotal > totalBudget : false;
    const overBudgetAmount =
      isOverBudget ? Number((actualExpensesTotal - totalBudget).toFixed(2)) : 0;

    res.status(200).json({
      success: true,
      data: {
        tripId: trip._id,
        tripName: trip.name,
        currency: trip.currency || 'USD',
        totalBudget,
        actualExpenses: actualExpensesTotal,
        plannedActivityCosts,
        estimatedTotal,
        remainingBudget,
        percentageUsed,
        averageDailyCost,
        tripDurationDays,
        isOverBudget,
        overBudgetAmount,
        categoryBreakdown,
        expenseCount: expenses.length,
        activityCount: itineraryItems.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
