import mongoose from 'mongoose';
import Expense, { EXPENSE_CATEGORIES } from '../models/Expense.js';
import Trip from '../models/Trip.js';
import ItineraryItem from '../models/ItineraryItem.js';

// Helper to format Date to YYYY-MM-DD
const toDateString = (d) => new Date(d).toISOString().slice(0, 10);

/**
 * POST /api/trips/:tripId/expenses
 * Protected — Log a new expense for an owned trip
 */
export const addExpense = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { category, description, amount, currency, date, itineraryItemId, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    // 1. Verify trip exists and is owned by user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or you do not have permission to modify it.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Validate expense date falls within trip dates
    const expenseDate = new Date(date);
    const expenseDateStr = toDateString(expenseDate);
    const tripStartStr = toDateString(trip.startDate);
    const tripEndStr = toDateString(trip.endDate);

    if (expenseDateStr < tripStartStr || expenseDateStr > tripEndStr) {
      const err = new Error(
        `Expense date (${expenseDateStr}) must fall within the trip dates (${tripStartStr} to ${tripEndStr}).`
      );
      err.statusCode = 400;
      return next(err);
    }

    // 3. If itineraryItemId is provided, verify it belongs to this trip
    if (itineraryItemId) {
      const item = await ItineraryItem.findOne({ _id: itineraryItemId, tripId: trip._id });
      if (!item) {
        const err = new Error(`Itinerary item "${itineraryItemId}" does not belong to this trip.`);
        err.statusCode = 404;
        return next(err);
      }
    }

    // 4. Create Expense
    const expense = await Expense.create({
      tripId: trip._id,
      category,
      description,
      amount: Number(amount),
      currency: currency || trip.currency || 'USD',
      date: expenseDate,
      itineraryItemId: itineraryItemId || null,
      notes: notes || null,
    });

    const populated = await Expense.findById(expense._id).populate({
      path: 'itineraryItemId',
      select: 'placeId date startTime endTime',
      populate: { path: 'placeId', select: 'name category' },
    });

    res.status(201).json({
      success: true,
      message: 'Expense logged successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trips/:tripId/expenses
 * Protected — List all expenses for a trip
 */
export const getTripExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { category, startDate, endDate } = req.query;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      const err = new Error(`Invalid Trip ID format: "${tripId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      const err = new Error('Trip not found or unauthorized.');
      err.statusCode = 404;
      return next(err);
    }

    const filter = { tripId: trip._id };

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(`${startDate}T00:00:00.000Z`);
      if (endDate) filter.date.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .populate({
        path: 'itineraryItemId',
        select: 'placeId date startTime endTime',
        populate: { path: 'placeId', select: 'name category' },
      });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/expenses/:expenseId
 * Protected — Update an expense
 */
export const updateExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      const err = new Error(`Invalid Expense ID format: "${expenseId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const expense = await Expense.findById(expenseId).populate('tripId');
    if (!expense) {
      const err = new Error('Expense not found.');
      err.statusCode = 404;
      return next(err);
    }

    // Verify ownership
    if (expense.tripId.userId.toString() !== req.user._id.toString()) {
      const err = new Error('You do not have permission to modify this expense.');
      err.statusCode = 403;
      return next(err);
    }

    const trip = expense.tripId;
    const { category, description, amount, currency, date, itineraryItemId, notes } = req.body;

    if (date) {
      const expenseDate = new Date(date);
      const expenseDateStr = toDateString(expenseDate);
      const tripStartStr = toDateString(trip.startDate);
      const tripEndStr = toDateString(trip.endDate);

      if (expenseDateStr < tripStartStr || expenseDateStr > tripEndStr) {
        const err = new Error(
          `Expense date (${expenseDateStr}) must fall within the trip dates (${tripStartStr} to ${tripEndStr}).`
        );
        err.statusCode = 400;
        return next(err);
      }
      expense.date = expenseDate;
    }

    if (itineraryItemId !== undefined) {
      if (itineraryItemId) {
        const item = await ItineraryItem.findOne({ _id: itineraryItemId, tripId: trip._id });
        if (!item) {
          const err = new Error(`Itinerary item "${itineraryItemId}" does not belong to this trip.`);
          err.statusCode = 404;
          return next(err);
        }
        expense.itineraryItemId = item._id;
      } else {
        expense.itineraryItemId = null;
      }
    }

    if (category) expense.category = category;
    if (description) expense.description = description;
    if (amount !== undefined) expense.amount = Number(amount);
    if (currency) expense.currency = currency;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();

    const populated = await Expense.findById(expense._id).populate({
      path: 'itineraryItemId',
      select: 'placeId date startTime endTime',
      populate: { path: 'placeId', select: 'name category' },
    });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/expenses/:expenseId
 * Protected — Delete an expense
 */
export const deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      const err = new Error(`Invalid Expense ID format: "${expenseId}"`);
      err.statusCode = 400;
      return next(err);
    }

    const expense = await Expense.findById(expenseId).populate('tripId');
    if (!expense) {
      const err = new Error('Expense not found.');
      err.statusCode = 404;
      return next(err);
    }

    if (expense.tripId.userId.toString() !== req.user._id.toString()) {
      const err = new Error('You do not have permission to delete this expense.');
      err.statusCode = 403;
      return next(err);
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
