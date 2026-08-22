import express from 'express';
import {
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateExpenseSchema } from '../validators/expense.validator.js';

const router = express.Router();

// All expense routes require authentication
router.use(protect);

/**
 * @route   PATCH /api/expenses/:expenseId
 * @desc    Update an expense
 * @access  Protected
 */
router.patch('/:expenseId', validate(updateExpenseSchema), updateExpense);

/**
 * @route   DELETE /api/expenses/:expenseId
 * @desc    Delete an expense
 * @access  Protected
 */
router.delete('/:expenseId', deleteExpense);

export default router;
