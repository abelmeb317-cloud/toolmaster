function Settings() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Store Name"
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Store Email"
        />

        <button className="rounded-xl bg-orange-500 px-6 py-3 text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;
