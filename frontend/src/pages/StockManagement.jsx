import { useState, useEffect } from "react";
import { Package, AlertTriangle, Loader2, CheckCircle2, ShoppingCart } from "lucide-react";
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

  // NOVA LÓGICA DE STATUS: OK (> 5) e REPOR (< 5)
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { label: "Esgotado", color: "bg-red-100 text-red-600", icon: <AlertTriangle className="h-3 w-3" /> };
    }
    if (stock < 5) {
      return { label: "Repor", color: "bg-orange-100 text-orange-600", icon: <AlertTriangle className="h-3 w-3" /> };
    }
    return { label: "OK", color: "bg-green-100 text-green-600", icon: <CheckCircle2 className="h-3 w-3" /> };
  };

  // Calcular quantidades vendidas por produto (pelo nome vindo do DTO do Java)
  const soldQuantities = {};
  vendas.forEach((venda) => {
    venda.itens.forEach((item) => {
      if (soldQuantities[item.nome]) {
        soldQuantities[item.nome] += item.quantidade;
      } else {
        soldQuantities[item.nome] = item.quantidade;
      }
    });
  });

  // Contador baseado na nova regra de < 5
  const itemsToRestock = products.filter(p => p.quantidadeEstoque < 5).length;

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#FF8C00]" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Cabeçalho Simplificado */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Controle de Estoque</h2>
          <p className="text-gray-500 font-medium">Monitoramento de insumos e disponibilidade</p>
        </div>
      </div>

      {/* Cards de Alerta Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-orange-500 flex items-center gap-5 hover:shadow-md transition-all">
          <div className="bg-orange-50 p-3 rounded-2xl">
            <AlertTriangle className="text-orange-500 h-8 w-8" />
          </div>
          <div>
            <h4 className="font-black text-gray-800 text-lg">{itemsToRestock} Itens para Repor</h4>
            <p className="text-sm text-gray-500 font-medium">Estoque abaixo de 5 unidades.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-blue-500 flex items-center gap-5 hover:shadow-md transition-all">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Package className="text-blue-500 h-8 w-8" />
          </div>
          <div>
            <h4 className="font-black text-gray-800 text-lg">{products.length} Produtos Ativos</h4>
            <p className="text-sm text-gray-500 font-medium">Variedade total no catálogo.</p>
          </div>
        </div>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-700">Inventário Detalhado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Em Estoque</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendidos</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Custo Unit.</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Venda</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400 font-medium italic">
                    Nenhum produto encontrado no banco SQLite.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getStockStatus(product.quantidadeEstoque);
                  const sold = soldQuantities[product.nome] || 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{product.nome}</p>
                        <p className="text-xs text-gray-400 font-medium">{product.descricao}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-gray-700 text-lg">{product.quantidadeEstoque}</span>
                        <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">un</span>
                      </td>
                      <td className="p-4 text-gray-500 font-bold">{sold} un</td>
                      
                      {/* Ajuste: Preço Unitário é o de COMPRA */}
                      <td className="p-4 text-red-400 font-medium">R$ {product.precoCompra.toFixed(2)}</td>
                      
                      {/* Ajuste: Valor Total é o de VENDA */}
                      <td className="p-4 font-black text-blue-600">R$ {product.precoVenda.toFixed(2)}</td>
                      
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${status.color}`}>
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