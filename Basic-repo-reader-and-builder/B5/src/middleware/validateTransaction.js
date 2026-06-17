const VALID_TYPES = new Set(["credit", "debit"]);

function validateTransaction(req, res, next) {
  const { amount, type, timestamp } = req.body || {};

  const errors = [];

  if (amount === undefined || amount === null) {
    errors.push({ field: "amount", message: "amount is required" });
  } else if (typeof amount !== "number" || Number.isNaN(amount)) {
    errors.push({ field: "amount", message: "amount must be a number" });
  } else if (amount <= 0) {
    errors.push({ field: "amount", message: "amount must be greater than 0" });
  }

  if (!type) {
    errors.push({ field: "type", message: "type is required" });
  } else if (!VALID_TYPES.has(type)) {
    errors.push({
      field: "type",
      message: 'type must be "credit" or "debit"',
    });
  }

  if (timestamp !== undefined && timestamp !== null) {
    const parsed = Date.parse(timestamp);
    if (Number.isNaN(parsed)) {
      errors.push({ field: "timestamp", message: "timestamp must be a valid ISO date" });
    } else {
      req.body.timestamp = new Date(parsed).toISOString();
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
}

module.exports = { validateTransaction };
