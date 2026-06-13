const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const CATEGORY_COLORS = {
  Food: "bg-red-100 text-red-800",
  Transport: "bg-blue-100 text-blue-800",
  Shopping: "bg-purple-100 text-purple-800",
  Bills: "bg-yellow-100 text-yellow-800",
  Entertainment: "bg-pink-100 text-pink-800",
  Health: "bg-green-100 text-green-800",
  Education: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
};

const CURRENCY_SYMBOL = "Rs";

const SHEETS = {
  EXPENSES: "Expenses",
  INCOME: "Income",
};

const SHEET_HEADERS = {
  [SHEETS.EXPENSES]: [
    "id",
    "userId",
    "amount",
    "category",
    "date",
    "note",
    "createdAt",
    "updatedAt",
  ],
  [SHEETS.INCOME]: [
    "id",
    "userId",
    "amount",
    "source",
    "date",
    "note",
    "createdAt",
    "updatedAt",
  ],
};

module.exports = {
  CATEGORIES,
  CATEGORY_COLORS,
  CURRENCY_SYMBOL,
  SHEETS,
  SHEET_HEADERS,
};
