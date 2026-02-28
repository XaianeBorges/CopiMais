import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Package, Loader2, Search } from "lucide-react";
import api from "../services/api";

export function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // ESTADO DA PESQUISA
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    precoCompra: "",
    precoVenda: "",
    quantidadeEstoque: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/produtos");
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    }
  };

  // LÓGICA DE FILTRAGEM (EM MEMÓRIA)
  // Filtra por nome ou descrição conforme o usuário digita
  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      precoCompra: "",
      precoVenda: "",
      quantidadeEstoque: "",
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      precoCompra: parseFloat(formData.precoCompra),
      precoVenda: parseFloat(formData.precoVenda),
      quantidadeEstoque: parseInt(formData.quantidadeEstoque),
    };

    try {
      if (editingProduct) {
        await api.put(`/produtos/${editingProduct.id}`, payload);
      } else {
        await api.post("/produtos", payload);
      }
      loadProducts();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      alert("Erro ao salvar produto. Verifique se você está logado.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        loadProducts();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      precoCompra: product.precoCompra,
      precoVenda: product.precoVenda,
      quantidadeEstoque: product.quantidadeEstoque,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h2>
          <p className="text-gray-500">Cadastre e gerencie o estoque da sua copiadora</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e67e00] text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </button>
      </div>

      {/* BARRA DE PESQUISA*/}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5 group-focus-within:text-[#87CEEB] transition-colors" />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou descrição..." 
          className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Nome</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Descrição</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Preço Venda</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Estoque</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{product.nome}</td>
                  <td className="p-4 text-gray-500 text-sm">{product.descricao}</td>
                  <td className="p-4 text-blue-600 font-black">R$ {product.precoVenda.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${product.quantidadeEstoque < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {product.quantidadeEstoque} un
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-10 text-center flex flex-col items-center gap-2">
              <Package className="h-10 w-10 text-gray-200" />
              <p className="text-gray-400 italic">Nenhum produto encontrado para sua busca.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
              <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome do Produto</label>
                <input
                  className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Descrição</label>
                <input
                  className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Custo (R$)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                    value={formData.precoCompra}
                    onChange={(e) => setFormData({ ...formData, precoCompra: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Venda (R$)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                    value={formData.precoVenda}
                    onChange={(e) => setFormData({ ...formData, precoVenda: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Quantidade Estoque</label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
                  value={formData.quantidadeEstoque}
                  onChange={(e) => setFormData({ ...formData, quantidadeEstoque: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-100 hover:bg-[#e67e00] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (editingProduct ? "Atualizar Produto" : "Salvar Produto")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}