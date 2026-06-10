import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900 focus:shadow"
      >
        Skip to content
      </a>

      <Navbar />
      <main id="main-content" className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
