import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Package, Loader2 } from "lucide-react";
import api from "../services/api"; // Nosso Axios configurado

export function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado do formulário batendo com os nomes do seu Java
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    precoCompra: "",
    precoVenda: "",
    quantidadeEstoque: "",
  });

  // 1. Carregar produtos do Backend ao abrir a tela
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

  // 2. Salvar ou Atualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convertendo valores para o formato que o Java espera (BigDecimal e Integer)
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
      loadProducts(); // Recarrega a lista
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      alert("Erro ao salvar produto. Verifique se você está logado.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Deletar (Exclusão Lógica)
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h2>
          <p className="text-gray-500">Cadastre e gerencie o estoque da sua copiadora</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e67e00] text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </button>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Nome</th>
              <th className="p-4 font-semibold text-gray-700">Descrição</th>
              <th className="p-4 font-semibold text-gray-700">Preço Venda</th>
              <th className="p-4 font-semibold text-gray-700">Estoque</th>
              <th className="p-4 font-semibold text-gray-700 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                product={product} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-10 text-center text-gray-400">Nenhum produto encontrado.</div>
        )}
      </div>

      {/* Modal / Dialog (Tailwind Puro) */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
              <button onClick={() => setIsDialogOpen(false)}><X className="text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <input
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Custo (R$)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full p-2 border rounded-lg"
                    value={formData.precoCompra}
                    onChange={(e) => setFormData({ ...formData, precoCompra: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Venda (R$)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full p-2 border rounded-lg"
                    value={formData.precoVenda}
                    onChange={(e) => setFormData({ ...formData, precoVenda: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={formData.quantidadeEstoque}
                  onChange={(e) => setFormData({ ...formData, quantidadeEstoque: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF8C00] text-white py-3 rounded-lg font-bold hover:bg-[#e67e00] flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Salvar Produto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente de Linha da Tabela para organização
function TableRow({ product, onEdit, onDelete }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-4 font-medium text-gray-800">{product.nome}</td>
      <td className="p-4 text-gray-600">{product.descricao}</td>
      <td className="p-4 text-green-600 font-bold">R$ {product.precoVenda.toFixed(2)}</td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.quantidadeEstoque < 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {product.quantidadeEstoque} un
        </span>
      </td>
      <td className="p-4">
        <div className="flex justify-center gap-3">
          <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700">
            <Edit2 className="h-5 w-5" />
          </button>
          <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}