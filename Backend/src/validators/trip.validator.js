import { z } from 'zod';
import mongoose from 'mongoose';

// Helper for validating ISO date string or Date-compatible string
const createDateSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required (e.g. "2026-07-01")`,
      invalid_type_error: `${fieldName} must be a valid date string`,
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid date string (e.g. "YYYY-MM-DD")`,
    });

const createObjectIdSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a valid MongoDB ObjectId`,
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: `${fieldName} must be a valid 24-character hex MongoDB ObjectId`,
    });

// Helper to coerce FormData string numbers or undefined to actual Numbers
const coerceNumber = (fieldName, defaultValue = 0) =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return defaultValue;
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }, z.number({ invalid_type_error: `${fieldName} must be a number` }).min(0, `${fieldName} must be non-negative`));

// ─── Trip Schemas ─────────────────────────────────────────────────────────────

export const createTripSchema = z
  .object({
    name: z
      .string({
        required_error: 'name is required',
        invalid_type_error: 'name must be a string',
      })
      .trim()
      .min(1, 'Trip name cannot be empty')
      .max(100, 'Trip name cannot exceed 100 characters'),

    description: z.string().trim().max(1000).nullable().optional(),

    startDate: createDateSchema('startDate'),

    endDate: createDateSchema('endDate'),

    coverImage: z.string().trim().nullable().optional(),

    totalBudget: coerceNumber('totalBudget', 0).optional().default(0),

    currency: z.string().trim().max(10).optional().default('USD'),

    status: z
      .enum(['planning', 'ongoing', 'completed', 'cancelled'], {
        invalid_type_error: "status must be one of: 'planning', 'ongoing', 'completed', 'cancelled'",
      })
      .optional()
      .default('planning'),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'startDate must be before or equal to endDate',
    path: ['endDate'],
  });

export const updateTripSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    startDate: createDateSchema('startDate').optional(),
    endDate: createDateSchema('endDate').optional(),
    coverImage: z.string().trim().nullable().optional(),
    totalBudget: z.preprocess((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    }, z.number().min(0, 'totalBudget must be non-negative').optional()),
    currency: z.string().trim().max(10).optional(),
    status: z.enum(['planning', 'ongoing', 'completed', 'cancelled']).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'startDate must be before or equal to endDate',
      path: ['endDate'],
    }
  );

// ─── TripStop Schemas ─────────────────────────────────────────────────────────

export const createTripStopSchema = z
  .object({
    cityId: createObjectIdSchema('cityId'),
    startDate: createDateSchema('startDate'),
    endDate: createDateSchema('endDate'),
    order: z.preprocess((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    }, z.number().int().min(1, 'order must be a positive integer').optional()),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'startDate must be before or equal to endDate',
    path: ['endDate'],
  });

export const updateTripStopSchema = z
  .object({
    cityId: createObjectIdSchema('cityId').optional(),
    startDate: createDateSchema('startDate').optional(),
    endDate: createDateSchema('endDate').optional(),
    order: z.preprocess((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    }, z.number().int().min(1, 'order must be a positive integer').optional()),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'startDate must be before or equal to endDate',
      path: ['endDate'],
    }
  );

export const reorderTripStopsSchema = z.object({
  stopIds: z
    .array(createObjectIdSchema('stopId'), {
      required_error: 'stopIds array is required',
    })
    .min(1, 'At least one stop ID is required to reorder'),
});
