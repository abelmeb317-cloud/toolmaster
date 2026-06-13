function Inventory() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Inventory</h1>

      <div className="space-y-3">
        <div className="flex justify-between rounded-xl border p-4">
          <span>Hammer</span>
          <span>45 Units</span>
        </div>

        <div className="flex justify-between rounded-xl border p-4">
          <span>Drill</span>
          <span>20 Units</span>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
