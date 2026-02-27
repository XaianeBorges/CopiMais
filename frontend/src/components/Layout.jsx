import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Copy, Package, Warehouse, ShoppingCart, FileText, LogOut } from "lucide-react";
import api from "../services/api";

export function Layout({ userName }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar", error);
    }
  };

  const menuItems = [
    { path: "/vendas", label: "Vendas (PDV)", icon: ShoppingCart },
    { path: "/produtos", label: "Cadastros", icon: Package },
    { path: "/estoque", label: "Estoque", icon: Warehouse },
    { path: "/relatorios", label: "Financeiro", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Fixo */}
      <header className="bg-[#87CEEB] border-b shadow-md sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF8C00] p-2 rounded-xl shadow-inner">
              <Copy className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">CopiMais</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-blue-800 font-medium">Operador Ativo</p>
              <p className="font-bold text-gray-900">{userName || "Admin"}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/40 px-4 py-2 rounded-xl font-bold">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar com NavLink (Gerencia classe 'active' automaticamente) */}
        <aside className="w-64 bg-white border-r shadow-sm p-6 space-y-4 hidden md:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Menu Principal</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                    isActive 
                    ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-200" 
                    : "text-gray-500 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* O Outlet é onde as páginas (Vendas, Estoque, etc) serão renderizadas */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}