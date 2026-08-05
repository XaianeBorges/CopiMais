import { useState, useEffect } from "react";
import { Package, AlertTriangle, Loader2, CheckCircle2, ShoppingCart } from "lucide-react";
import api from "../services/api";

export function StockManagement() {
  const [products, setProducts] = useState([]);
  const [vendasMes, setVendasMes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mesAtual = new Date().getMonth() + 1;
      const anoAtual = new Date().getFullYear();

      // Buscamos apenas os dados do mês atual para o estoque (Performance!)
      const [resProd, resDash] = await Promise.all([
        api.get("/produtos"),
        api.get(`/dashboard/detalhado?mes=${mesAtual}&ano=${anoAtual}`)
      ]);
      
      setProducts(resProd.data);
      // Pegamos a lista de itens vendidos que o nosso dashboard detalhado já traz
      setVendasMes(resDash.data.produtosMaisVendidos);
    } catch (error) {
      console.error("Erro ao buscar dados do estoque", error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Esgotado", color: "bg-red-100 text-red-600", icon: <AlertTriangle className="h-3 w-3" /> };
    if (stock < 5) return { label: "Repor", color: "bg-orange-100 text-orange-600", icon: <AlertTriangle className="h-3 w-3" /> };
    return { label: "OK", color: "bg-green-100 text-green-600", icon: <CheckCircle2 className="h-3 w-3" /> };
  };

  const itemsToRestock = products.filter(p => p.quantidadeEstoque < 5).length;

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#FF8C00]" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Controle de Estoque</h2>
          <p className="text-gray-500 font-medium">Quantidades vendidas referente ao mês atual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-orange-500 flex items-center gap-5">
          <AlertTriangle className="text-orange-500 h-8 w-8" />
          <div>
            <h4 className="font-black text-gray-800 text-lg">{itemsToRestock} Itens para Repor</h4>
            <p className="text-sm text-gray-500">Abaixo de 5 unidades.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-blue-500 flex items-center gap-5">
          <Package className="text-blue-500 h-8 w-8" />
          <div>
            <h4 className="font-black text-gray-800 text-lg">{products.length} Produtos</h4>
            <p className="text-sm text-gray-500">No catálogo ativo.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque Atual</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-blue-600">Vendidos (Mês)</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Custo Unit.</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Venda</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                const status = getStockStatus(product.quantidadeEstoque);
                
                // PERFORMANCE SÊNIOR: Procura a quantidade vendida no resumo que o back já mandou
                const dadosVendaMes = vendasMes.find(v => v.nome === product.nome);
                const totalVendidoMes = dadosVendaMes ? dadosVendaMes.quantidade : 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{product.nome}</p>
                      <p className="text-xs text-gray-400">{product.descricao}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-gray-700">{product.quantidadeEstoque}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                        {totalVendidoMes} un
                      </span>
                    </td>
                    <td className="p-4 text-red-400 text-sm">R$ {product.precoCompra.toFixed(2)}</td>
                    <td className="p-4 font-black text-gray-800">R$ {product.precoVenda.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}