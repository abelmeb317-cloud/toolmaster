import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import api from "../../api/axios";

function Topbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .get("/profile")
      .then((res) => {
        if (!mounted) return;
        setUsername(res?.data?.user?.username || "");
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-slate-400" />

        <input
          placeholder="Search..."
          className="rounded-xl border pl-10 pr-4 py-2"
        />
      </div>

      <div className="flex items-center gap-4">
        <FaBell className="text-xl text-slate-600" />

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/50"
            alt=""
            className="h-10 w-10 rounded-full"
          />

          <div>
            <p className="font-semibold">{username || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
