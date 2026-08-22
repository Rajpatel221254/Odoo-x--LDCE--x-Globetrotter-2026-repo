import { z } from 'zod';

const dateStringSchema = (fieldName) =>
  z
    .string({
      invalid_type_error: `${fieldName} must be a valid date string`,
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${fieldName} must be a valid date string (e.g. "YYYY-MM-DD")`,
    });

// ─── Create Share Link Schema ─────────────────────────────────────────────────

export const createShareLinkSchema = z
  .object({
    expiresAt: z
      .preprocess(
        (val) => (val === '' || val === null || val === undefined ? null : val),
        dateStringSchema('expiresAt').nullable().optional()
      ),

    customSlug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, 'customSlug must be at least 3 characters')
      .max(50, 'customSlug cannot exceed 50 characters')
      .regex(/^[a-z0-9-]+$/, 'customSlug can only contain lowercase letters, numbers, and dashes')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.expiresAt) {
        return new Date(data.expiresAt) > new Date();
      }
      return true;
    },
    {
      message: 'expiresAt must be a future date',
      path: ['expiresAt'],
    }
  );

// ─── Copy Trip Schema ─────────────────────────────────────────────────────────

export const copyTripSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Trip name cannot be empty')
    .max(100, 'Trip name cannot exceed 100 characters')
    .optional(),
});
