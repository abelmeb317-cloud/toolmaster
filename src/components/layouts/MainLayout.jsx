import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { useLocation } from "react-router-dom";

function MainLayout({ children }) {
  const { pathname } = useLocation();

  // Hide navbar/footer on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  // Hide footer on admin pages
  const isAdminPage = pathname.startsWith("/admin");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900 focus:shadow"
      >
        Skip to content
      </a>

      {!isAuthPage && <Navbar />}

      <main id="main-content" className={isAuthPage ? "py-12" : "pt-24"}>
        {children}
      </main>

      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}

export default MainLayout;
