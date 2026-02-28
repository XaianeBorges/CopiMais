import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, X, DollarSign, Info } from "lucide-react"; // Info substituindo a ideia do Tooltip
import api from "../services/api";

export function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: "", descricao: "", preco: "", precoCusto: "" });

  useEffect(() => { 
    loadServices(); 
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.get("/servicos");
      setServices(res.data);
    } catch (error) { 
      console.error("Erro ao carregar serviços:", error); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envia os dados para o Backend Java
      await api.post("/servicos", { 
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoCusto: parseFloat(formData.precoCusto) 
      });
      setIsDialogOpen(false);
      setFormData({ nome: "", descricao: "", preco: "", precoCusto: "" });
      loadServices();
    } catch (error) {
      alert("Erro ao salvar serviço. Verifique a conexão com o banco.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente remover este serviço do catálogo?")) {
      try {
        await api.delete(`/servicos/${id}`);
        loadServices();
      } catch (error) {
        alert("Erro ao excluir serviço.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Tabela de Serviços</h2>
          <p className="text-gray-500">Configure os valores de mão de obra e custos de insumos</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#FF8C00] text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-[#e67e00] transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" /> Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-gray-400 uppercase text-[10px] font-black tracking-widest">Serviço / Descrição</th>
              <th className="p-4 text-gray-400 uppercase text-[10px] font-black tracking-widest text-center">Custo Est.</th>
              <th className="p-4 text-gray-400 uppercase text-[10px] font-black tracking-widest text-center">Preço Venda</th>
              <th className="p-4 text-gray-400 uppercase text-[10px] font-black tracking-widest text-center">Margem (Lucro)</th>
              <th className="p-4 text-center text-gray-400 uppercase text-[10px] font-black tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Nenhum serviço cadastrado.</td></tr>
            ) : (
              services.map(s => {
                const margem = s.preco - s.precoCusto;
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{s.nome}</p>
                      <p className="text-xs text-gray-400">{s.descricao || "Sem descrição"}</p>
                    </td>
                    <td className="p-4 text-center font-medium text-red-500">R$ {s.precoCusto.toFixed(2)}</td>
                    <td className="p-4 text-center font-black text-blue-600">R$ {s.preco.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                        + R$ {margem.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(s.id)} className="text-red-300 hover:text-red-600 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">Cadastrar Serviço</h3>
              <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nome do Serviço</label>
                <input 
                  placeholder="Ex: Impressão Colorida A4" 
                  className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Descrição</label>
                <input 
                  placeholder="Opcional" 
                  className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                  value={formData.descricao}
                  onChange={e => setFormData({...formData, descricao: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    Custo (Tinta/Papel) <Info className="h-3 w-3 text-gray-300" />
                  </label>
                  <input 
                    type="number" step="0.01" placeholder="0.00"
                    className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-300 transition-all"
                    value={formData.precoCusto}
                    onChange={e => setFormData({...formData, precoCusto: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Preço Venda</label>
                  <input 
                    type="number" step="0.01" placeholder="0.00"
                    className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-green-300 transition-all"
                    value={formData.preco}
                    onChange={e => setFormData({...formData, preco: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#e67e00] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirmar Cadastro"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}