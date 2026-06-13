import { useEffect, useState } from "react";
import api from "../../api/axios";

function Customers() {
  const [users, setUsers] = useState([]);

  const load = () => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}`, { role });
    load();
  };

  const remove = async (id) => {
    setConfirm({
      title: "Delete user",
      message: "Are you sure you want to delete this user?",
      onConfirm: async () => {
        await api.delete(`/admin/users/${id}`);
        load();
      },
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Customers / Users</h1>

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-xl border p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{u.username}</div>
              <div className="text-sm text-slate-500">{u.role}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  changeRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")
                }
                className="rounded px-3 py-1 bg-orange-500 text-white"
              >
                Toggle Role
              </button>
              <button
                onClick={() => remove(u.id)}
                className="rounded px-3 py-1 bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;
