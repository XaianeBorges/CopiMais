import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, AlertCircle, Loader2 } from "lucide-react";
import api from "../services/api"; // O serviço Axios que criamos

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
      // Chamada real para o seu AuthController do Java
      const response = await api.post("/auth/login", {
        username: username,
        password: password
      });

      if (response.status === 200) {

        window.location.href = "/vendas"; 
      }
    } catch (err) {
       setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#87CEEB] to-[#FF8C00] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header do Card (Baseado no seu Figma) */}
        <div className="p-8 pb-4 text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-[rgb(96,176,237)] p-3 rounded-lg shadow-md">
                <Copy className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-[#000000]">CopiMais</h1>
            </div>
            
            {/* Detalhe das Barras Coloridas do seu design */}
            <div className="flex gap-1 w-48">
              <div className="h-1 flex-1 bg-[#87CEEB] rounded-full"></div>
              <div className="h-1 flex-1 bg-[#FF8C00] rounded-full"></div>
              <div className="h-1 flex-1 bg-[#000000] rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800">Bem-vindo!</h2>
          <p className="text-gray-500">Faça login para acessar o sistema</p>
        </div>

        {/* Formulário */}
        <div className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Usuário</label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all bg-gray-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all bg-gray-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          CopiMais v1.0 - Sistema de Gerenciamento Local
        </div>
      </div>
    </div>
  );
}