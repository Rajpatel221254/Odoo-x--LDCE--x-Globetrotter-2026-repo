/**
 * validate(schema)
 *
 * Middleware that validates req.body against a Zod schema.
 * Formats errors with field names and returns a 422 Unprocessable Entity.
 *
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Format error message with exact field names: "name: Trip name is required, startDate: startDate is required"
    const messages = result.error.issues
      .map((issue) => {
        const field = issue.path.join('.');
        return field ? `${field}: ${issue.message}` : issue.message;
      })
      .join('; ');

    const err = new Error(messages);
    err.statusCode = 422;
    err.details = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));

    return next(err);
  }

  // Replace req.body with parsed/sanitized data
  req.body = result.data;
  next();
};
