import {
  FaChartBar,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaWarehouse,
  FaCog,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admin" },
    { name: "Products", icon: <FaBox />, path: "/admin/products" },
    { name: "Orders", icon: <FaShoppingBag />, path: "/admin/orders" },
    { name: "Customers", icon: <FaUsers />, path: "/admin/customers" },
    { name: "Inventory", icon: <FaWarehouse />, path: "/admin/inventory" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <aside className="w-60 bg-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500">ToolMaster</h1>
      </div>

      <nav className="space-y-2 px-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-orange-50"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
