import { useState, useEffect } from "react";
import { Download, TrendingUp, DollarSign, ShoppingBag, Loader2, Calendar, ArrowDownCircle, Wallet, AlertTriangle } from "lucide-react";
import api from "../services/api";
import * as XLSX from 'xlsx';

export function ReportsManagement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendasHistorico, setVendasHistorico] = useState([]);
  const [products, setProducts] = useState([]);

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const mesAtualNome = meses[new Date().getMonth()];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resDash, resHist, resProd] = await Promise.all([
        api.get("/dashboard"),
        api.get("/vendas/historico"),
        api.get("/produtos")
      ]);
      setData(resDash.data);
      setVendasHistorico(resHist.data);
      setProducts(resProd.data);
    } catch (error) {
      console.error("Erro ao carregar relatórios", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!data || vendasHistorico.length === 0) return;

    // 1. ABA: RESUMO GERAL
    const resumo = [
      { "Indicador": "Faturamento Mensal", "Valor": data.faturamentoMensal },
      { "Indicador": "Gastos (Custo Material/Insumos)", "Valor": data.custosMensal },
      { "Indicador": "Lucro Líquido", "Valor": data.lucroMensal },
      { "Indicador": "---", "Valor": "" },
      { "Indicador": "Vendas em PIX", "Valor": data.totalPixMensal },
      { "Indicador": "Vendas em CARTÃO", "Valor": data.totalCartaoMensal },
      { "Indicador": "Vendas em DINHEIRO", "Valor": data.totalDinheiroMensal },
    ];

    // 2. ABA: HISTÓRICO DE VENDAS (CABECALHO)
    const historico = vendasHistorico.map(v => ({
      "ID Venda": v.id,
      "Data/Hora": new Date(v.dataVenda).toLocaleString('pt-BR'),
      "Forma Pagamento": v.formaPagamento,
      "Valor Total": v.valorTotal
    }));

    // 3. ABA: ITENS VENDIDOS (DETALHADO) - O que você pediu!
    const itensDetalhado = [];
    vendasHistorico.forEach(venda => {
      venda.itens.forEach(item => {
        itensDetalhado.push({
          "Data": new Date(venda.dataVenda).toLocaleDateString('pt-BR'),
          "Venda ID": venda.id,
          "Produto/Serviço": item.nome,
          "Qtd Vendida": item.quantidade,
          "Preço Unitário": item.precoUnitario,
          "Subtotal": item.quantidade * item.precoUnitario,
          "Tipo Pagamento": venda.formaPagamento
        });
      });
    });

    // CRIAÇÃO DO WORKBOOK
    const wb = XLSX.utils.book_new();
    
    // Converte os JSONs para planilhas
    const wsResumo = XLSX.utils.json_to_sheet(resumo);
    const wsHistorico = XLSX.utils.json_to_sheet(historico);
    const wsItens = XLSX.utils.json_to_sheet(itensDetalhado);

    // Toque Sênior: Configurar larguras das colunas para ficar bonito
    wsResumo['!cols'] = [{ wch: 35 }, { wch: 15 }];
    wsHistorico['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 15 }];
    wsItens['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 35 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

    // Adiciona as abas
    XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo Financeiro");
    XLSX.utils.book_append_sheet(wb, wsHistorico, "Vendas (Resumo)");
    XLSX.utils.book_append_sheet(wb, wsItens, "Itens Vendidos (Lista)");

    // Salva o arquivo
    XLSX.writeFile(wb, `Relatorio_CopiMais_${mesAtualNome}.xlsx`);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#FF8C00]" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Financeiro - {mesAtualNome}</h2>
          <p className="text-gray-500 font-medium">Relatórios detalhados de faturamento e itens</p>
        </div>
        <button
          onClick={exportToExcel}
          className="bg-[#FF8C00] hover:bg-[#FF7F00] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-orange-200 flex items-center gap-2 transition-all active:scale-95"
        >
          <Download className="h-5 w-5" />
          Exportar Planilha Completa
        </button>
      </div>

      {/* Cards de Desempenho Mensal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Faturamento Mensal" value={data?.faturamentoMensal} icon={<DollarSign className="text-blue-500" />} color="text-blue-600" />
        <StatCard title="Gastos (Custo de Itens)" value={data?.custosMensal} icon={<ArrowDownCircle className="text-red-500" />} color="text-red-600" />
        <StatCard title="Lucro Líquido" value={data?.lucroMensal} icon={<TrendingUp className="text-green-500" />} color="text-green-600" />
      </div>

      {/* Pagamentos */}
      <div className="grid gap-6 md:grid-cols-3">
        <MiniCard title="Total em Dinheiro" value={data?.totalDinheiroMensal} icon={<Wallet className="text-orange-400" />} />
        <MiniCard title="Total em PIX" value={data?.totalPixMensal} icon={<TrendingUp className="text-green-400" />} />
        <MiniCard title="Total em Cartão" value={data?.totalCartaoMensal} icon={<Calendar className="text-purple-400" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Alertas de Estoque
          </h3>
          <div className="space-y-3">
            {data?.produtosAlertaEstoque?.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-2xl">
                <span className="font-bold text-gray-700">{p.nome}</span>
                <span className="text-red-600 font-black">{p.quantidadeAtual} un</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Últimas Vendas</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {vendasHistorico.slice(0, 10).map((venda) => (
              <div key={venda.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-gray-700">Venda #{venda.id}</span>
                  <span className="text-[#FF8C00] font-black">R$ {venda.valorTotal.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {venda.itens.map((item, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 font-bold">
                      {item.nome} x{item.quantidade}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">{title}</p>
        <h4 className={`text-2xl font-black ${color}`}>R$ {value?.toFixed(2) || "0.00"}</h4>
      </div>
      <div className="bg-gray-50 p-4 rounded-2xl">{icon}</div>
    </div>
  );
}

function MiniCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="bg-gray-50 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] text-gray-400 font-black uppercase">{title}</p>
        <p className="text-lg font-black text-gray-700">R$ {value?.toFixed(2) || "0.00"}</p>
      </div>
    </div>
  );
}