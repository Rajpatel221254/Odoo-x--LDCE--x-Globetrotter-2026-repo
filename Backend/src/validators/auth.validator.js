import { z } from 'zod';

// ─── Registration ─────────────────────────────────────────────────────────
export const registerSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1, 'First name cannot be empty')
    .max(50, 'First name cannot exceed 50 characters'),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(1, 'Last name cannot be empty')
    .max(50, 'Last name cannot exceed 50 characters'),

  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(
      /^\+?[1-9]\d{6,14}$/,
      'Invalid phone number. Use E.164 format e.g. +14155552671'
    ),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),

  city: z.string().trim().max(100).nullable().optional(),
  country: z.string().trim().max(100).nullable().optional(),
  additionalInfo: z.string().trim().max(500).nullable().optional(),
  profilePhoto: z.string().trim().nullable().optional(),
});

// ─── Login ────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

// ─── Profile update ───────────────────────────────────────────────────────
export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\+?[1-9]\d{6,14}$/, 'Invalid phone number')
      .optional(),
    city: z.string().trim().max(100).nullable().optional(),
    country: z.string().trim().max(100).nullable().optional(),
    additionalInfo: z.string().trim().max(500).nullable().optional(),
    profilePhoto: z.string().trim().nullable().optional(),
  })
  .strict();
