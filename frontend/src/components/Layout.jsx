import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Package, Warehouse, ShoppingCart, FileText, LogOut, Scissors } from "lucide-react";
import api from "../services/api";

export function Layout({ userName }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Erro ao deslogar", error);
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { path: "/vendas", label: "Vendas", icon: ShoppingCart },
    { path: "/produtos", label: "Produtos", icon: Package },
    { path: "/servicos", label: "Serviços", icon: Scissors },
    { path: "/estoque", label: "Estoque", icon: Warehouse },
    { path: "/relatorios", label: "Financeiro", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER AJUSTADO PARA CINZA CLARO */}
      <header className="bg-gray-200 border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          
          {/* LOGO COM LISTRAS VISÍVEIS */}
          <div className="flex flex-col cursor-default">
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
              Copimais
            </h1>
            <div className="flex flex-col gap-0.5 w-full mt-1">
              <div className="h-0.5 w-full bg-[#87CEEB] rounded-full"></div>
              <div className="h-0.5 w-full bg-[#FF8C00] rounded-full"></div>
              <div className="h-0.5 w-full bg-[#000000] rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Operador Logado</p>
              <p className="font-bold text-gray-800">{userName || "Administrador"}</p>
            </div>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
            >
              <LogOut className="h-4 w-4 text-red-500" /> 
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-6 space-y-4 hidden md:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Menu Principal</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                    isActive 
                    ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Área Principal */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}