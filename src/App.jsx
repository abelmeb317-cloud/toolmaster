import { useEffect } from "react";
import MainLayout from "./components/layouts/MainLayout";
import AppRoutes from "./components/routes/AppRoutes";
import useProductStore from "./components/store/productStore";

function App() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
