import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoginScreen } from "./pages/LoginScreen";
import { ProductsManagement } from "./pages/ProductsManagement";
import { StockManagement } from "./pages/StockManagement";
import { SalesManagement } from "./pages/SalesManagement";
import { ReportsManagement } from "./pages/ReportsManagement";
import { Layout } from "./components/Layout";
import { Loader2 } from "lucide-react";
import api from "./services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/me");
        setIsLoggedIn(true);
        setUserName(response.data.username);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-[#FF8C00]" /></div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Rotas Privadas (Protegidas pelo Layout e verificação de login) */}
        {isLoggedIn ? (
          <Route element={<Layout userName={userName} />}>
            <Route path="/vendas" element={<SalesManagement />} />
            <Route path="/produtos" element={<ProductsManagement />} />
            <Route path="/estoque" element={<StockManagement />} />
            <Route path="/relatorios" element={<ReportsManagement />} />
            {/* Redireciona a raiz para vendas */}
            <Route path="/" element={<Navigate to="/vendas" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}