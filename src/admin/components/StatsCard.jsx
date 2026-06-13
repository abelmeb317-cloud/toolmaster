function StatCard({ title, value, orange, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 shadow-sm transition-colors duration-150 ${
        orange
          ? "bg-orange-600  text-white hover:bg-amber-600"
          : "bg-white hover:bg-orange-300"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <p>{title}</p>

      <h2 className="mt-2 text-4xl font-bold">{value}</h2>
    </div>
  );
}

export default StatCard;
