const CATEGORY_COLORS = {
  Food: "bg-red-100 text-red-700",
  Transport: "bg-blue-100 text-blue-700",
  Shopping: "bg-purple-100 text-purple-700",
  Bills: "bg-yellow-100 text-yellow-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Health: "bg-green-100 text-green-700",
  Education: "bg-indigo-100 text-indigo-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {category}
    </span>
  );
}
