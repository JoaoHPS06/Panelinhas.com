import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BotaoPrincipal } from "../components/BotaoPrincipal";
import { CardProduto } from "../components/CardProduto";
import type { Produto } from "../components/LojaProdutos";

// Formato que a API de favoritos devolve (ver ProdutoSerializer no backend)
interface ProdutoFavoritoAPI {
  id: number;
  loja: number;
  nome: string;
  descricao: string | null;
  preco: string;
  emoji: string;
  criado_em: string;
}

/** Skeleton no formato de card de produto, exibido enquanto a lista carrega */
const ProdutoSkeleton = () => (
  <div className="bg-white border border-cafe-expresso/10 rounded-2xl p-4 h-56 animate-pulse flex flex-col gap-3">
    <div className="w-full h-24 rounded-xl bg-marrom-rustico/10" />
    <div className="w-3/4 h-4 rounded bg-marrom-rustico/10" />
    <div className="w-1/2 h-3 rounded bg-marrom-rustico/10" />
    <div className="mt-auto w-1/3 h-5 rounded bg-marrom-rustico/15" />
  </div>
);

export const ProdutosFavoritos = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<(Produto & { lojaId: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [removendoId, setRemovendoId] = useState<string | null>(null);

  useEffect(() => {
    buscarFavoritos();
  }, []);

  const getToken = () => {
    const userString = localStorage.getItem("Panelinha_user");
    return userString ? JSON.parse(userString).access : null;
  };

  // Traduz o JSON do Django para o formato do componente CardProduto
  const adaptarProduto = (d: ProdutoFavoritoAPI): Produto & { lojaId: number } => ({
    id: String(d.id),
    image: d.emoji || "📦", // o CardProduto renderiza isso como texto/emoji, não como <img>
    nome: d.nome,
    descricao: d.descricao || "",
    preco: parseFloat(d.preco) || 0,
    lojaId: d.loja,
  });

  const buscarFavoritos = async () => {
    setLoading(true);
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/produtos/favoritos/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const dados = await res.json();
        setProdutos(dados.map(adaptarProduto));
      }
    } catch (error) {
      console.error("Erro ao buscar os produtos favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const desfavoritar = async (produtoId: string) => {
    try {
      setRemovendoId(produtoId);
      const token = getToken();

      const res = await fetch(
        `http://localhost:8000/api/produtos/${produtoId}/favoritar/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setProdutos((prev) => prev.filter((p) => p.id !== produtoId));
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
    } finally {
      setRemovendoId(null);
    }
  };

  const valorTotal = produtos.reduce((acc, p) => acc + p.preco, 0);
  const lojasDiferentes = new Set(produtos.map((p) => p.lojaId)).size;

  const formatarPreco = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  return (
    <div className="max-w-5xl mx-auto pt-20 px-6 pb-12 font-nunito min-h-screen space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-marrom-rustico/10 pb-6">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-marrom-rustico/60 hover:text-vermelho-pimenta transition-colors mb-2 cursor-pointer"
          >
            ← Voltar para a rua
          </button>
          <h1
            className="text-4xl font-extrabold text-[#2A1F14]"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Produtos Favoritos
          </h1>
          <p className="text-[#6B5040] text-sm mt-1">
            Os itens que você guardou para não perder de vista.
          </p>
        </div>

        <div className="shrink-0">
          <BotaoPrincipal texto="Explorar lojas" onClick={() => navigate("/explore")} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-marrom-rustico/10 p-5 rounded-2xl shadow-sm h-19 animate-pulse"
              />
            ))}
          </div>
          <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProdutoSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4"
              style={{ borderTopColor: "#D85A30" }}
            >
              <span className="text-3xl bg-creme-suave p-3 rounded-xl">❤️</span>
              <div>
                <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">
                  Produtos favoritados
                </p>
                <p className="text-2xl font-black text-cafe-expresso">{produtos.length}</p>
              </div>
            </div>
            <div
              className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4"
              style={{ borderTopColor: "#3F7FD1" }}
            >
              <span className="text-3xl bg-creme-suave p-3 rounded-xl">🏪</span>
              <div>
                <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">
                  Lojas diferentes
                </p>
                <p className="text-2xl font-black text-cafe-expresso">{lojasDiferentes}</p>
              </div>
            </div>
            <div
              className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4"
              style={{ borderTopColor: "#C99020" }}
            >
              <span className="text-3xl bg-creme-suave p-3 rounded-xl">💰</span>
              <div>
                <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">
                  Valor total estimado
                </p>
                <p className="text-2xl font-black text-cafe-expresso">
                  {formatarPreco(valorTotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner relative overflow-hidden min-h-100">
            {produtos.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                <span className="text-5xl block mb-4">🛍️</span>
                <h3 className="text-lg font-bold text-[#2A1F14] mb-1">
                  Você ainda não favoritou nenhum produto
                </h3>
                <p className="text-[#6B5040] text-sm mb-6 max-w-sm">
                  Explore as lojas da rua e clique no coração dos produtos que
                  você quiser guardar para depois.
                </p>
                <BotaoPrincipal texto="Explorar a rua" onClick={() => navigate("/explore")} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {produtos.map((produto) => (
                  <div key={produto.id} className="relative group">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        desfavoritar(produto.id);
                      }}
                      disabled={removendoId === produto.id}
                      title="Remover dos favoritos"
                      className="absolute -top-2 -right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-vermelho-pimenta border border-vermelho-pimenta/20 shadow-md hover:bg-vermelho-pimenta hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {removendoId === produto.id ? "…" : "❤️"}
                    </button>
                    <div onClick={() => navigate(`/loja/${produto.lojaId}`)}>
                      <CardProduto
                        image={produto.image}
                        nome={produto.nome}
                        descricao={produto.descricao}
                        preco={produto.preco}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};