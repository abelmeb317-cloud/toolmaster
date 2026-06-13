import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex bg-orange">
      <Sidebar />

      <main className="flex-1 p-6">
        <Topbar />

        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
