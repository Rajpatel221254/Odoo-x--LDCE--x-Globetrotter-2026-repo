/**
 * validate(schema)
 *
 * Returns an Express middleware that validates req.body against the given
 * Zod schema. On failure, it forwards a structured 422 error to the global
 * error handler, matching the existing { success, message } response format.
 *
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Collect all Zod issue messages into one readable string
    const messages = result.error.issues.map((i) => i.message).join('. ');
    const err = new Error(messages);
    err.statusCode = 422;
    return next(err);
  }

  // Replace req.body with the parsed (and potentially transformed) data
  req.body = result.data;
  next();
};
