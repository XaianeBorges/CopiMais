import { useState, useEffect } from "react";
import { Download, TrendingUp, DollarSign, Calendar, ArrowDownCircle, Search, Loader2, FileSpreadsheet, Wallet, CreditCard } from "lucide-react";
import api from "../services/api";
import * as XLSX from 'xlsx';

export function ReportsManagement() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  // Pegamos a data atual do computador para inicializar os estados
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const generateYears = () => {
    const startYear = 2026;
    const currentYear = new Date().getFullYear();
    const years = [];
 
    for (let y = currentYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  };

  const anosDisponiveis = generateYears();

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/detalhado?mes=${selectedMonth}&ano=${selectedYear}`);
      setReportData(res.data);
    } catch (error) {
      console.error("Erro ao buscar relatório", error);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!reportData) return;

    const wb = XLSX.utils.book_new();

    const resumo = [
      { "Mês Referência": meses[selectedMonth - 1], "Ano": selectedYear },
      { "Faturamento Total": reportData.faturamentoTotal, "Despesas": reportData.despesasTotais, "Lucro Líquido": reportData.lucroLiquido },
      { "Dinheiro": reportData.totalDinheiro, "PIX": reportData.totalPix, "Cartão": reportData.totalCartao }
    ];

    const wsResumo = XLSX.utils.json_to_sheet(resumo);
    const wsDias = XLSX.utils.json_to_sheet(reportData.vendasPorDia);
    const wsProdutos = XLSX.utils.json_to_sheet(reportData.produtosMaisVendidos);

    XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
    XLSX.utils.book_append_sheet(wb, wsDias, "Faturamento por Dia");
    XLSX.utils.book_append_sheet(wb, wsProdutos, "Produtos e Serviços");

    XLSX.writeFile(wb, `Relatorio_CopiMais_${meses[selectedMonth-1]}_${selectedYear}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Relatório Mensal</h2>
          <p className="text-gray-500 font-medium text-sm">Visão detalhada do faturamento e métodos de pagamento</p>
        </div>

        {/* SELECIONADOR DE MÊS/ANO DINÂMICO */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <select 
            className="p-2 outline-none font-bold text-gray-600 bg-transparent cursor-pointer"
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
          >
            {meses.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          
          <select 
            className="p-2 outline-none font-bold text-gray-600 bg-transparent border-l pl-2 cursor-pointer"
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
          >
            {/* MAPEAMENTO DINÂMICO DOS ANOS */}
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>

          <button onClick={exportExcel} className="bg-green-500 text-white p-2 px-4 rounded-xl hover:bg-green-600 transition-all flex items-center gap-2 font-bold text-xs">
            <FileSpreadsheet className="h-4 w-4" /> EXCEL
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-[#FF8C00]" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardFin title="Faturamento Bruto" value={reportData?.faturamentoTotal} icon={<DollarSign className="text-blue-500" />} color="text-blue-600" />
            <CardFin title="Despesas Totais" value={reportData?.despesasTotais} icon={<ArrowDownCircle className="text-red-500" />} color="text-red-600" />
            <CardFin title="Lucro Líquido" value={reportData?.lucroLiquido} icon={<TrendingUp className="text-green-500" />} color="text-green-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MiniCard title="Vendas em Dinheiro" value={reportData?.totalDinheiro} icon={<Wallet className="text-orange-500" />} />
            <MiniCard title="Vendas em PIX" value={reportData?.totalPix} icon={<TrendingUp className="text-cyan-500" />} />
            <MiniCard title="Vendas em Cartão" value={reportData?.totalCartao} icon={<CreditCard className="text-purple-500" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#87CEEB]" /> Evolução Diária
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {reportData?.vendasPorDia.map((v, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors">
                    <span className="font-bold text-gray-600">{new Date(v.data).toLocaleDateString('pt-BR')}</span>
                    <div className="text-right">
                       <p className="font-black text-gray-800">R$ {v.total.toFixed(2)}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{v.quantidadeVendas} vendas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-[#FF8C00]" /> Itens Vendidos
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {reportData?.produtosMaisVendidos.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 group hover:bg-orange-50 rounded-xl transition-all">
                    <div>
                      <p className="font-bold text-gray-700 group-hover:text-orange-600 transition-colors">{p.nome}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase">{p.quantidade} unidades saíram</p>
                    </div>
                    <span className="font-black text-blue-600">R$ {p.totalGerado.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CardFin({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className={`text-2xl font-black ${color}`}>R$ {value?.toFixed(2) || "0.00"}</h4>
      </div>
      <div className="bg-gray-50 p-4 rounded-2xl">{icon}</div>
    </div>
  );
}

function MiniCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-orange-200 transition-all">
      <div className="bg-gray-50 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{title}</p>
        <p className="text-xl font-black text-gray-800">R$ {value?.toFixed(2) || "0.00"}</p>
      </div>
    </div>
  );
}