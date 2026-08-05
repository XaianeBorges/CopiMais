import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  ShoppingCart,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

export function SalesManagement() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("PRODUTO");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resProd, resServ] = await Promise.all([
        api.get("/produtos"),
        api.get("/servicos"),
      ]);
      setProducts(resProd.data);
      setServices(resServ.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  // --- FUNÇÃO 1: ATUALIZA ENQUANTO DIGITA (PERMITE VAZIO) ---
  const updateCartQuantity = (id, tipo, value) => {
    setCart(
      cart.map((item) => {
        if (item.id === id && item.tipo === tipo) {
          // Permitimos o valor vazio "" ou o número digitado
          return { ...item, quantidade: value === "" ? "" : parseInt(value) };
        }
        return item;
      }),
    );
  };

  // --- FUNÇÃO 2: VALIDA QUANDO O USUÁRIO SAI DO CAMPO (BLUR) ---
  const validateQuantityOnBlur = (id, tipo, value) => {
    const val = parseInt(value);

    setCart(
      cart.map((item) => {
        if (item.id === id && item.tipo === tipo) {
          let finalQty = val;

          // 1. Se estiver vazio ou menor que 1, volta para 1
          if (isNaN(val) || val < 1) {
            finalQty = 1;
          }

          // 2. Se for produto, checa estoque máximo
          if (tipo === "PRODUTO") {
            const originalProduct = products.find((p) => p.id === id);
            if (finalQty > originalProduct.quantidadeEstoque) {
              alert(
                `Estoque insuficiente! Máximo: ${originalProduct.quantidadeEstoque}`,
              );
              finalQty = originalProduct.quantidadeEstoque;
            }
          }

          return { ...item, quantidade: finalQty };
        }
        return item;
      }),
    );
  };

  const addToCart = (item) => {
    const isProduto = activeTab === "PRODUTO";
    if (isProduto && item.quantidadeEstoque <= 0) {
      alert("Produto sem estoque!");
      return;
    }

    const existing = cart.find((i) => i.id === item.id && i.tipo === activeTab);

    if (existing) {
      // Se já existe, apenas somamos 1 e validamos
      const newQty = (parseInt(existing.quantidade) || 0) + 1;
      updateCartQuantity(item.id, activeTab, newQty);
      validateQuantityOnBlur(item.id, activeTab, newQty);
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          nome: item.nome,
          quantidade: 1,
          precoUnitario: isProduto ? item.precoVenda : item.preco,
          tipo: activeTab,
        },
      ]);
    }
  };

  const removeFromCart = (id, tipo) => {
    setCart(cart.filter((i) => !(i.id === id && i.tipo === tipo)));
  };

  // Ajuste no total para ignorar campos vazios enquanto digita
  const getCartTotal = () =>
    cart.reduce((sum, i) => {
      const qty = parseInt(i.quantidade) || 0;
      return sum + qty * i.precoUnitario;
    }, 0);

  const handleFinalizeSale = async () => {
    if (cart.length === 0) return alert("Carrinho vazio!");
    setLoading(true);
    const payload = {
      formaPagamento: paymentMethod,
      itens: cart.map((i) => ({
        id: i.id,
        quantidade: parseInt(i.quantidade) || 1,
        tipo: i.tipo,
      })),
    };

    try {
      await api.post("/vendas", payload);
      setCart([]);
      alert("Venda realizada com sucesso!");
      loadData();
    } catch (error) {
      alert("Erro ao finalizar venda.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = (activeTab === "PRODUTO" ? products : services).filter(
    (item) =>
      item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Ponto de Venda
          </h2>
          <p className="text-gray-500 font-medium italic">
            Terminal de Atendimento Local
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* BUSCA DE ITENS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm flex gap-4 border border-gray-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-12 p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#87CEEB]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Garante que atualiza o estado
              />
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab("PRODUTO")}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "PRODUTO" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
              >
                Produtos
              </button>
              <button
                onClick={() => setActiveTab("SERVICO")}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "SERVICO" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
              >
                Serviços
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-[2rem] border-2 border-transparent hover:border-[#87CEEB] transition-all cursor-pointer group shadow-sm"
                onClick={() => addToCart(item)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{item.nome}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-black mt-1">
                      {item.descricao || "Item de Catálogo"}
                    </p>
                  </div>
                  <span className="bg-blue-50 text-blue-600 font-black px-3 py-1.5 rounded-xl text-sm">
                    R$ {(item.precoVenda || item.preco).toFixed(2)}
                  </span>
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <span
                    className={`text-[10px] font-black uppercase ${activeTab === "PRODUTO" && item.quantidadeEstoque < 5 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {activeTab === "PRODUTO"
                      ? `Estoque: ${item.quantidadeEstoque}`
                      : "Mão de obra"}
                  </span>
                  <div className="bg-[#87CEEB] text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                    <Plus className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARRINHO */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col h-full overflow-hidden border border-gray-100">
            <div className="p-7 bg-[#1e293b] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-[#87CEEB]" />
                <h3 className="text-xl font-black italic tracking-tighter">
                  Carrinho
                </h3>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[350px]">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.tipo}`}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm mb-2">
                      {item.nome}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-16 p-2 bg-white border border-gray-200 rounded-xl text-center font-black text-blue-600 focus:ring-2 focus:ring-[#87CEEB] outline-none transition-all"
                        value={item.quantidade}
                        // ATUALIZAÇÃO ENQUANTO DIGITA
                        onChange={(e) =>
                          updateCartQuantity(item.id, item.tipo, e.target.value)
                        }
                        // VALIDAÇÃO QUANDO SAI DO CAMPO
                        onBlur={(e) =>
                          validateQuantityOnBlur(
                            item.id,
                            item.tipo,
                            e.target.value,
                          )
                        }
                      />
                      <span className="text-[10px] text-gray-400 font-black uppercase">
                        Unidades
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-black text-gray-800">
                      R${" "}
                      {(
                        (parseInt(item.quantidade) || 0) * item.precoUnitario
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id, item.tipo)}
                      className="text-red-300 hover:text-red-500 transition-colors mt-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-7 bg-gray-50 border-t border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Pagamento
                </label>
                <select
                  className="w-full p-4 rounded-2xl bg-white border-none shadow-sm font-bold text-gray-700 outline-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="DINHEIRO">💵 Dinheiro</option>
                  <option value="PIX">💎 PIX</option>
                  <option value="CARTAO">💳 Cartão</option>
                </select>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  Subtotal
                </span>
                <span className="text-4xl font-black text-[#FF8C00]">
                  R$ {getCartTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleFinalizeSale}
                disabled={loading || cart.length === 0}
                className="w-full bg-[#FF8C00] hover:bg-[#e67e00] disabled:bg-gray-200 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-7 w-7" />
                ) : (
                  <CheckCircle2 className="h-7 w-7" />
                )}
                Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
