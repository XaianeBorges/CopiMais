import { useState, useEffect } from "react";
import { Package, AlertTriangle, Loader2, TrendingDown, DollarSign } from "lucide-react";
import api from "../services/api";

export function StockManagement() {
  const [products, setProducts] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscamos produtos e histórico de vendas para calcular as estatísticas
      const [resProd, resVendas] = await Promise.all([
        api.get("/produtos"),
        api.get("/vendas/historico")
      ]);
      setProducts(resProd.data);
      setVendas(resVendas.data);
    } catch (error) {
      console.error("Erro ao buscar dados do estoque", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Status do Estoque
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Esgotado", color: "bg-red-100 text-red-600", icon: <AlertTriangle className="h-3 w-3" /> };
    if (stock < 10) return { label: "Crítico", color: "bg-orange-100 text-orange-600", icon: <TrendingDown className="h-3 w-3" /> };
    return { label: "Normal", color: "bg-green-100 text-green-600", icon: null };
  };

  // Calcular quantidades vendidas por produto
  const soldQuantities = {};
  vendas.forEach((venda) => {
    venda.itens.forEach((item) => {
      // Como o Java retorna o nome no DTO, vamos mapear pelo nome do produto
      if (soldQuantities[item.nome]) {
        soldQuantities[item.nome] += item.quantidade;
      } else {
        soldQuantities[item.nome] = item.quantidade;
      }
    });
  });

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantidadeEstoque * p.precoVenda), 0);
  const lowStockCount = products.filter(p => p.quantidadeEstoque < 10).length;

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#FF8C00]" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Controle de Estoque</h2>
          <p className="text-gray-500">Gestão de insumos e mercadorias da copiadora</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
             <DollarSign className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Valor em Estoque</p>
            <p className="text-xl font-black text-gray-800">R$ {totalInventoryValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Cards de Alerta Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500 flex items-center gap-4">
          <AlertTriangle className="text-orange-500 h-8 w-8" />
          <div>
            <h4 className="font-bold text-gray-800">{lowStockCount} Itens com estoque baixo</h4>
            <p className="text-sm text-gray-500">Considere repor esses itens em breve.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex items-center gap-4">
          <Package className="text-blue-500 h-8 w-8" />
          <div>
            <h4 className="font-bold text-gray-800">{products.length} Produtos cadastrados</h4>
            <p className="text-sm text-gray-500">Total de variedades no seu inventário.</p>
          </div>
        </div>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Inventário Detalhado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Produto</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Em Estoque</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Vendidos</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Preço Unit.</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Valor Total</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400 italic">Nenhum produto cadastrado no sistema.</td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getStockStatus(product.quantidadeEstoque);
                  const totalValue = product.quantidadeEstoque * product.precoVenda;
                  const sold = soldQuantities[product.nome] || 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{product.nome}</p>
                        <p className="text-xs text-gray-400">{product.descricao}</p>
                      </td>
                      <td className="p-4 font-semibold text-gray-700">{product.quantidadeEstoque} un</td>
                      <td className="p-4 text-gray-500">{sold} un</td>
                      <td className="p-4 text-gray-500">R$ {product.precoVenda.toFixed(2)}</td>
                      <td className="p-4 font-bold text-blue-600">R$ {totalValue.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}