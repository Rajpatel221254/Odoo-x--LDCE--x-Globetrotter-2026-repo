import { z } from 'zod';
import mongoose from 'mongoose';

// Helper for validating ISO date string
const dateStringSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required (e.g. "2026-07-02")`,
      invalid_type_error: `${fieldName} must be a valid date string`,
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid date string (e.g. "YYYY-MM-DD")`,
    });

// Helper for validating 24-character hex MongoDB ObjectId
const objectIdSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a valid MongoDB ObjectId`,
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: `${fieldName} must be a valid 24-character hex MongoDB ObjectId`,
    });

// Helper for validating 24-hour time format (HH:mm or HH:mm:ss)
const timeSchema = (fieldName) =>
  z
    .string({
      required_error: `${fieldName} is required (e.g. "09:00")`,
      invalid_type_error: `${fieldName} must be a time string (e.g. "09:00" or "14:30")`,
    })
    .trim()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      `${fieldName} must be in 24-hour format (e.g. "09:00", "14:30")`
    );

// ─── Create Itinerary Item Schema ─────────────────────────────────────────────

export const createItineraryItemSchema = z
  .object({
    tripStopId: objectIdSchema('tripStopId'),
    cityId: objectIdSchema('cityId'),
    placeId: objectIdSchema('placeId'),
    date: dateStringSchema('date'),
    startTime: timeSchema('startTime'),
    endTime: timeSchema('endTime'),
    order: z
      .preprocess(
        (val) => (val === undefined || val === null || val === '' ? undefined : Number(val)),
        z.number().int().min(1, 'order must be a positive integer').optional()
      ),
    notes: z.string().trim().max(1000).nullable().optional(),
    estimatedCost: z
      .preprocess(
        (val) => (val === undefined || val === null || val === '' ? undefined : Number(val)),
        z.number().min(0, 'estimatedCost must be non-negative').optional()
      ),
  })
  .refine(
    (data) => data.startTime < data.endTime,
    {
      message: 'startTime must be earlier than endTime (e.g. "09:00" before "11:00")',
      path: ['endTime'],
    }
  );

// ─── Update Itinerary Item Schema ─────────────────────────────────────────────

export const updateItineraryItemSchema = z
  .object({
    tripStopId: objectIdSchema('tripStopId').optional(),
    cityId: objectIdSchema('cityId').optional(),
    placeId: objectIdSchema('placeId').optional(),
    date: dateStringSchema('date').optional(),
    startTime: timeSchema('startTime').optional(),
    endTime: timeSchema('endTime').optional(),
    order: z
      .preprocess(
        (val) => (val === undefined || val === null || val === '' ? undefined : Number(val)),
        z.number().int().min(1, 'order must be a positive integer').optional()
      ),
    notes: z.string().trim().max(1000).nullable().optional(),
    estimatedCost: z
      .preprocess(
        (val) => (val === undefined || val === null || val === '' ? undefined : Number(val)),
        z.number().min(0, 'estimatedCost must be non-negative').optional()
      ),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: 'startTime must be earlier than endTime',
      path: ['endTime'],
    }
  );

// ─── Reorder Schema ───────────────────────────────────────────────────────────

export const reorderItinerarySchema = z.object({
  itemIds: z
    .array(objectIdSchema('itemId'), {
      required_error: 'itemIds array is required',
    })
    .min(1, 'At least one item ID is required to reorder'),
});
