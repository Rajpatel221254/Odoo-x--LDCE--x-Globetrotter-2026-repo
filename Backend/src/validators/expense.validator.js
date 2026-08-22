import { z } from 'zod';
import mongoose from 'mongoose';

const dateStringSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required (e.g. "2026-07-05")`,
      invalid_type_error: `${fieldName} must be a valid date string`,
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid date string (e.g. "YYYY-MM-DD")`,
    });

const objectIdSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a valid MongoDB ObjectId`,
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: `${fieldName} must be a valid 24-character hex MongoDB ObjectId`,
    });

export const EXPENSE_CATEGORIES = [
  'transport',
  'accommodation',
  'food',
  'activity',
  'miscellaneous',
];

// Helper to coerce FormData or numeric strings to Numbers
const coercePositiveNumber = (fieldName) =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }, z.number({ required_error: `${fieldName} is required`, invalid_type_error: `${fieldName} must be a number` }).gt(0, `${fieldName} must be a positive number greater than 0`));

// ─── Create Expense Schema ───────────────────────────────────────────────────

export const createExpenseSchema = z.object({
  category: z
    .enum(EXPENSE_CATEGORIES, {
      required_error: `category is required (${EXPENSE_CATEGORIES.join(', ')})`,
      invalid_type_error: `category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`,
    }),

  description: z
    .string({
      required_error: 'description is required',
      invalid_type_error: 'description must be a string',
    })
    .trim()
    .min(1, 'description cannot be empty')
    .max(200, 'description cannot exceed 200 characters'),

  amount: coercePositiveNumber('amount'),

  currency: z.string().trim().max(10).optional().default('USD'),

  date: dateStringSchema('date'),

  itineraryItemId: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : val),
      objectIdSchema('itineraryItemId').nullable().optional()
    ),

  notes: z.string().trim().max(1000).nullable().optional(),
});

// ─── Update Expense Schema ───────────────────────────────────────────────────

export const updateExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES).optional(),

  description: z.string().trim().min(1).max(200).optional(),

  amount: z
    .preprocess((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    }, z.number().gt(0, 'amount must be a positive number greater than 0').optional()),

  currency: z.string().trim().max(10).optional(),

  date: dateStringSchema('date').optional(),

  itineraryItemId: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : val),
      objectIdSchema('itineraryItemId').nullable().optional()
    ),

  notes: z.string().trim().max(1000).nullable().optional(),
});
