import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, AlertCircle, Loader2 } from "lucide-react";
import api from "../services/api"; 

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Chamada para o AuthController do Java
      const response = await api.post("/auth/login", {
        username: username,
        password: password
      });

      if (response.status === 200) {
        // Força o recarregamento para sincronizar o cookie de sessão no notebook
        window.location.href = "/vendas"; 
      }
    } catch (err) {
       setError("Usuário ou senha incorretos.");
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#87CEEB] to-[#FF8C00] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header do Card */}
        <div className="p-8 pb-4 text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-[rgb(96,176,237)] p-3 rounded-2xl shadow-lg shadow-blue-100">
                <Copy className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-black text-[#000000] tracking-tighter">CopiMais</h1>
            </div>
            
            {/* AJUSTE SÊNIOR: Listras em coluna (uma embaixo da outra) */}
            <div className="flex flex-col gap-1.5 w-48">
              <div className="h-1.5 w-full bg-[#87CEEB] rounded-full shadow-sm"></div>
              <div className="h-1.5 w-full bg-[#FF8C00] rounded-full shadow-sm"></div>
              <div className="h-1.5 w-full bg-[#000000] rounded-full shadow-sm"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800">Bem-vindo!</h2>
          <p className="text-gray-500 font-medium">Faça login para gerenciar sua copiadora</p>
        </div>

        {/* Formulário */}
        <div className="p-8 pt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm border border-red-100 animate-pulse">
                <AlertCircle className="h-5 w-5" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Usuário</label>
              <input
                type="text"
                placeholder="Ex: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all bg-gray-50 font-medium text-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all bg-gray-50 font-medium text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-6 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            CopiMais v1.0 • Gestão Local Offline
          </p>
        </div>
      </div>
    </div>
  );
}