/**
 * Validation Middleware - وسيط التحقق من صحة الطلبات
 * Minimal request validator using JSON Schema-like rules.
 */

// Very lightweight schema validator (subset) to avoid adding new deps
function validateAgainstSchema(data, schema) {
  const errors = [];
  if (!schema || typeof schema !== 'object') return errors;

  if (schema.type === 'object' && schema.properties) {
    for (const [key, rules] of Object.entries(schema.properties)) {
      const value = data[key];
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: key, message: 'Field is required', messageAr: 'الحقل مطلوب' });
        continue;
      }
      if (value !== undefined && rules.type) {
        const actual = Array.isArray(value) ? 'array' : typeof value;
        if (actual !== rules.type) {
          errors.push({
            field: key,
            message: `Expected ${rules.type}`,
            messageAr: `يجب أن يكون ${rules.type}`,
          });
        }
      }
      if (
        value !== undefined &&
        rules.minLength &&
        typeof value === 'string' &&
        value.length < rules.minLength
      ) {
        errors.push({
          field: key,
          message: `Minimum length ${rules.minLength}`,
          messageAr: `الحد الأدنى للطول ${rules.minLength}`,
        });
      }
    }
  }
  return errors;
}

export const validateRequest = schema => (req, res, next) => {
  try {
    const data = { ...(req.body || {}), ...(req.params || {}), ...(req.query || {}) };
    const errors = validateAgainstSchema(data, schema);
    if (errors.length > 0) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.messageAr = 'فشل التحقق من صحة البيانات';
      err.details = { errors };
      throw err;
    }
    next();
  } catch (e) {
    next(e);
  }
};
