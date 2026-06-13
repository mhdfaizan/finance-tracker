const { CATEGORIES } = require("./constants");

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getTimestamp() {
  return new Date().toISOString();
}

function validateExpense(data) {
  const errors = [];
  const amount = parseFloat(data.amount);
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push("Amount must be a positive number");
  }
  if (!CATEGORIES.includes(data.category)) {
    errors.push(`Invalid category. Must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (!data.date) {
    errors.push("Date is required");
  }
  return errors;
}

function validateIncome(data) {
  const errors = [];
  const amount = parseFloat(data.amount);
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push("Amount must be a positive number");
  }
  if (!data.source || !data.source.trim()) {
    errors.push("Source is required");
  }
  if (!data.date) {
    errors.push("Date is required");
  }
  return errors;
}

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const start = `${year}-${month}-01`;
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
  return { start, end, year, month };
}

function isDateInRange(dateStr, start, end) {
  return dateStr >= start && dateStr <= end;
}

function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return num.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function serializeRecord(record, headers) {
  return headers.map((h) => record[h] ?? "").join("|");
}

module.exports = {
  generateId,
  getTimestamp,
  validateExpense,
  validateIncome,
  getCurrentMonthRange,
  isDateInRange,
  formatCurrency,
  serializeRecord,
};
