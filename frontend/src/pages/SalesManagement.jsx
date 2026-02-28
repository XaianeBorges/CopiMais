import { useState, useEffect } from "react";
import { Search, Plus, Trash2, ShoppingCart, Loader2, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export function SalesManagement() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("PRODUTO"); 

  // 1. Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resProd, resServ] = await Promise.all([
        api.get("/produtos"),
        api.get("/servicos")
      ]);
      setProducts(resProd.data);
      setServices(resServ.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  // 2. Filtragem Dinâmica
  const filteredItems = (activeTab === "PRODUTO" ? products : services).filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Lógica do Carrinho
  const addToCart = (item) => {
    const isProduto = activeTab === "PRODUTO";
    
    // Validação de estoque para produtos
    if (isProduto && item.quantidadeEstoque <= 0) {
      alert("Produto sem estoque!");
      return;
    }

    const existing = cart.find(i => i.id === item.id && i.tipo === activeTab);

    if (existing) {
      if (isProduto && existing.quantidade + 1 > item.quantidadeEstoque) {
        alert("Limite de estoque atingido!");
        return;
      }
      setCart(cart.map(i => 
        (i.id === item.id && i.tipo === activeTab) 
        ? { ...i, quantidade: i.quantidade + 1 } : i
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        nome: item.nome,
        quantidade: 1,
        precoUnitario: isProduto ? item.precoVenda : item.preco,
        tipo: activeTab
      }]);
    }
  };

  const removeFromCart = (id, tipo) => {
    setCart(cart.filter(i => !(i.id === id && i.tipo === tipo)));
  };

  const getCartTotal = () => cart.reduce((sum, i) => sum + (i.quantidade * i.precoUnitario), 0);

  // 4. Finalizar Venda (Integração com Java)
  const handleFinalizeSale = async () => {
    if (cart.length === 0) return alert("Carrinho vazio!");
    
    setLoading(true);
    const payload = {
      formaPagamento: paymentMethod,
      itens: cart.map(i => ({
        id: i.id,
        quantidade: i.quantidade,
        tipo: i.tipo
      }))
    };

    try {
      await api.post("/vendas", payload);
      setCart([]);
      alert("Venda realizada com sucesso!");
      loadData(); // Recarrega estoque
    } catch (error) {
      alert("Erro ao finalizar venda: " + error.response?.data || "Verifique o estoque.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Ponto de Venda</h2>
          <p className="text-gray-500">Registre as vendas da copiadora rapidamente</p>
        </div>
        <div className="text-right">
           <p className="text-sm text-gray-400">Data da Venda</p>
           <p className="font-bold text-gray-700">{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LADO ESQUERDO: Busca de Itens */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full pl-10 p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#87CEEB]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Toggle de Categoria */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab("PRODUTO")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "PRODUTO" ? 'bg-white shadow-md text-blue-600' : 'text-gray-500'}`}
              >Produtos</button>
              <button 
                onClick={() => setActiveTab("SERVICO")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "SERVICO" ? 'bg-white shadow-md text-blue-600' : 'text-gray-500'}`}
              >Serviços</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-transparent hover:border-[#87CEEB] transition-all cursor-pointer group shadow-sm" onClick={() => addToCart(item)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{item.nome}</h4>
                    <p className="text-xs text-gray-400">{item.descricao}</p>
                  </div>
                  <span className="bg-green-100 text-green-600 font-bold px-2 py-1 rounded-lg text-sm">
                    R$ {(item.precoVenda || item.preco).toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-xs font-bold ${activeTab === "PRODUTO" && item.quantidadeEstoque < 5 ? 'text-red-500' : 'text-gray-400'}`}>
                    {activeTab === "PRODUTO" ? `Estoque: ${item.quantidadeEstoque}` : 'Serviço sob demanda'}
                  </span>
                  <div className="bg-[#87CEEB] text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LADO DIREITO: Carrinho e Finalização */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl shadow-xl flex flex-col h-full overflow-hidden border border-gray-100">
            <div className="p-6 bg-[#1e293b] text-white flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <h3 className="text-xl font-bold">Carrinho de Venda</h3>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[400px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <ShoppingCart className="h-16 w-16 mb-2" />
                  <p>Carrinho vazio</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={`${item.id}-${item.tipo}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                    <div>
                      <p className="font-bold text-gray-700">{item.nome}</p>
                      <p className="text-xs text-gray-400">{item.quantidade}x R$ {item.precoUnitario.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-blue-600">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id, item.tipo)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Forma de Pagamento</label>
                <select 
                  className="w-full p-3 rounded-xl bg-white border-none shadow-sm font-bold text-gray-700 outline-none"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <option value="DINHEIRO">💵 Dinheiro</option>
                  <option value="PIX">💎 PIX</option>
                  <option value="CARTAO">💳 Cartão</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 font-medium">Total a pagar:</span>
                <span className="text-3xl font-black text-[#FF8C00]">R$ {getCartTotal().toFixed(2)}</span>
              </div>

              <button 
                onClick={handleFinalizeSale}
                disabled={loading || cart.length === 0}
                className="w-full bg-[#FF8C00] hover:bg-[#e67e00] disabled:bg-gray-300 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}