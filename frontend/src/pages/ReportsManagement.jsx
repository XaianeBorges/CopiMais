import { useState, useEffect } from "react";
import { Download, TrendingUp, DollarSign, ShoppingBag, Loader2, Calendar } from "lucide-react";
import api from "../services/api";

export function ReportsManagement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendasHistorico, setVendasHistorico] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchHistoricoVendas();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricoVendas = async () => {
    try {
      // Endpoint que retorna a lista de VendaResponseDTO do Java
      const response = await api.get("/vendas/historico"); 
      setVendasHistorico(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  };

  const downloadReport = () => {
    const reportData = {
      dataGeracao: new Date().toLocaleString("pt-BR"),
      resumoFinanceiro: {
        totalVendasHoje: data?.faturamentoTotalHoje,
        totalPix: data?.totalPix,
        totalCartao: data?.totalCartao,
        totalDinheiro: data?.totalDinheiro,
      },
      estoqueAlerta: data?.produtosAlertaEstoque,
      historicoVendas: vendasHistorico
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-copimais-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#FF8C00]" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Relatórios e Análises</h2>
          <p className="text-gray-500">Desempenho financeiro e histórico da copiadora</p>
        </div>
        <button
          onClick={downloadReport}
          className="bg-[#FF8C00] hover:bg-[#FF7F00] text-white px-5 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition-all"
        >
          <Download className="h-5 w-5" />
          Baixar JSON de Fechamento
        </button>
      </div>

      {/* Cards de Resumo (Dados vindos do DashboardService Java) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Faturamento Hoje" value={data?.faturamentoTotalHoje} icon={<DollarSign className="text-blue-500" />} />
        <StatCard title="Total em PIX" value={data?.totalPix} icon={<TrendingUp className="text-green-500" />} />
        <StatCard title="Total em Cartão" value={data?.totalCartao} icon={<Calendar className="text-purple-500" />} />
        <StatCard title="Vendas Realizadas" value={data?.totalVendasHoje} isCurrency={false} icon={<ShoppingBag className="text-orange-500" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Produtos com Estoque Baixo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-red-500" /> Alertas de Estoque
          </h3>
          <div className="space-y-4">
            {data?.produtosAlertaEstoque.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Tudo em dia com o estoque.</p>
            ) : (
              data?.produtosAlertaEstoque.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-gray-700">{p.nome}</span>
                  <span className="text-red-600 font-bold">{p.quantidadeAtual} un</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Histórico Recente */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Últimas Vendas</h3>
          <div className="space-y-3">
            {vendasHistorico.slice(0, 5).map((venda) => (
              <div key={venda.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-sm font-bold text-gray-800">Venda #{venda.id}</p>
                  <p className="text-xs text-gray-400">{venda.formaPagamento}</p>
                </div>
                <span className="text-[#FF8C00] font-bold">R$ {venda.valorTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Card de Estatística (Tailwind Puro)
function StatCard({ title, value, icon, isCurrency = true }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-gray-800">
          {isCurrency ? `R$ ${value?.toFixed(2) || "0.00"}` : value}
        </h4>
      </div>
      <div className="bg-gray-50 p-3 rounded-xl">{icon}</div>
    </div>
  );
}