import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewPredioLoja, type Loja} from "../components/NewPredioLoja";

const LOJAS_MOCK: Loja[] =[
    {
    id: 1,
    name: "Pizzaria do Zé",
    category: "🍽️ Alimentação",
    emoji: "🍕",
    rating: 4.8,
    followers: 127,
    isOpen: true,
    windows: [true, false, true],
    primary: "#E2703A",
    secondary: "#FFD9A8",
  },
  {
    id: 2,
    name: "Moda Feminina Ana",
    category: "👗 Moda",
    emoji: "👗",
    rating: 4.6,
    followers: 89,
    isOpen: true,
    windows: [false, true, false],
    primary: "#9B59D0",
    secondary: "#EDD8F8",
  },
  {
    id: 3,
    name: "TechShop Eletrônicos",
    category: "💻 Eletrônicos",
    emoji: "💻",
    rating: 4.7,
    followers: 234,
    isOpen: true,
    tall: true,
    windows: [true, true, false],
    primary: "#3F7FD1",
    secondary: "#C8DDF8",
  },
  {
    id: 4,
    name: "Beleza Natural",
    category: "💄 Beleza",
    emoji: "💄",
    rating: 4.9,
    followers: 312,
    isOpen: false,
    windows: [false, true, false],
    primary: "#D9568C",
    secondary: "#FFD8E8",
  },
  {
    id: 5,
    name: "Artesanato Mineiro",
    category: "🏺 Artesanato",
    emoji: "🏺",
    rating: 4.5,
    followers: 56,
    isOpen: true,
    windows: [false, true, false],
    primary: "#4F9C42",
    secondary: "#D4EEC8",
  },
  {
    id: 6,
    name: "Padaria Estrela",
    category: "🍽️ Alimentação",
    emoji: "🥐",
    rating: 4.8,
    followers: 178,
    isOpen: true,
    windows: [true, false, true],
    primary: "#C99020",
    secondary: "#FFF2C4",
  },
  {
    id: 7,
    name: "Pet Amor",
    category: "🐾 Pet",
    emoji: "🐾",
    rating: 4.4,
    followers: 41,
    isOpen: true,
    windows: [false, true, false],
    primary: "#5878C0",
    secondary: "#D8E8F8",
  },
  {
    id: 8,
    name: "Livraria Cultura",
    category: "📚 Livros",
    emoji: "📚",
    rating: 4.7,
    followers: 93,
    isOpen: false,
    windows: [true, false, true],
    primary: "#A06820",
    secondary: "#F0DEBA",
  },
]

const categorias = [
    "🏪 Todas",
    "🍽️ Alimentação",
    "👗 Moda",
    "💻 Eletrônicos",
    "💄 Beleza",
    "🏺 Artesanato",
    "🐾 Pet",
    "📚 Livros",
    "🌱 Aberto agora",
];

const BuildingSkeleton = () => (
  <div className="w-40.5 flex flex-col items-center gap-2 animate-pulse">
    <div className="w-40.5 h-7 rounded-t-md bg-marrom-rustico/15" />
    <div className="w-40.5 h-27 rounded-t-md bg-marrom-rustico/10" />
    <div className="w-40.5 h-7 rounded-b bg-marrom-rustico/10" />
  </div>
);

const FaixaDeCalcada = () => (
  <div
    className="-mx-8 -mb-8 mt-8 h-3 rounded-b-3xl relative overflow-hidden"
    style={{ background: "linear-gradient(180deg, #D4C4A8 0%, #C0B09A 100%)" }}
  >
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
      style={{
        background:
          "repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 12px, transparent 12px, transparent 20px)",
      }}
    />
  </div>
);

type Ordenacao = "rating" | "followers";

const ORDENACOES: { key: Ordenacao; label: string; emoji: string }[] = [
  { key: "rating", label: "Mais bem avaliadas", emoji: "⭐" },
  { key: "followers", label: "Mais seguidas", emoji: "👥" },
];

export const Explore = () => {
    const navigate = useNavigate();
    const [lojas, setLojas] =useState<Loja[]>([])
    const [loading, setLoading] = useState(true);
    const [categoriaAtiva, setCategoriaAtiva] = useState("🏪 Todas");
    const [ordenacao, setOrdenacao] = useState<Ordenacao>("rating");

    useEffect(() => {
        const temporizador = setTimeout(() => {
            setLojas(LOJAS_MOCK);
            setLoading(false);
        }, 800);

        return () => clearTimeout(temporizador);
    }, []);

    let lojasExibidas = lojas;
    if (categoriaAtiva === "🌱 Aberto agora"){
        lojasExibidas = lojasExibidas.filter((loja) => loja.isOpen);
    }
    else if (categoriaAtiva !=="🏪 Todas"){
        lojasExibidas = lojasExibidas.filter((loja) => loja.category === categoriaAtiva)
    }

    lojasExibidas = [...lojasExibidas].sort((a, b) => {
        if (ordenacao === "rating") return b.rating - a.rating;
        else return b.followers - a.followers;
    });

    const limparFiltros = () => {
        setCategoriaAtiva("🏪 Todas");
    };

    return(
      <div className="max-w-5xl mx-auto pt-40 px-6 pb-12 font-nunito min-h-screen space-y-8">
        <div className="border-b border-marrom-rustico/10 pb-6">
          <h1
            className="text-4xl font-extrabold text-[#2A1F14]"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Explore
          </h1>
          <p className="pt-1 text-[#6B5040] text-base mt-1">
            Descubra as lojas mais bem avaliadas e mais seguidas da nossa rua virtual.
          </p>
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E8878] block mb-3">
            Tipo de loja
          </span>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                  categoriaAtiva === cat
                    ? "bg-[#D85A30] text-white shadow-md"
                    : "bg-white border border-marrom-rustico/15 text-marrom-rustico/70 hover:border-vermelho-pimenta/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E8878]">
            {loading
              ? "Carregando lojas..."
              : `${lojasExibidas.length} ${lojasExibidas.length === 1 ? "loja encontrada" : "lojas encontradas"}`}
          </span>
          <div className="inline-flex bg-white border border-marrom-rustico/10 rounded-full p-1 shadow-sm self-start">
            {ORDENACOES.map((op) => (
              <button
                key={op.key}
                onClick={() => setOrdenacao(op.key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  ordenacao === op.key
                    ? "bg-cafe-expresso text-white shadow"
                    : "text-marrom-rustico/50 hover:text-marrom-rustico"
                  }`}
              >
                <span>{op.emoji}</span>
                {op.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-inner border border-marrom-rustico/10">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #BFE0F5 0%, #EAF6FD 65%, #FAF7F4 100%)" }}
          />
          <div/>
          <div className="relative p-8">
            {loading ? (
              <>
                <span className="text-xs font-extrabold uppercase tracking-widest text-marrom-rustico/40 block mb-6">
                  Construindo a rua...
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <BuildingSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : lojasExibidas.length === 0 ? (
              <div className="bg-white/90 border border-marrom-rustico/10 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="text-lg font-bold text-[#2A1F14] mb-1">
                  Nenhuma loja encontrada
                </h3>
                <p className="text-[#6B5040] text-sm mb-6">
                  Não há lojas para esse filtro no momento. Tente escolher outra
                  categoria.
                </p>
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 rounded-md font-bold bg-vermelho-pimenta text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <span className="text-xs font-extrabold uppercase tracking-widest text-marrom-rustico/40 block mb-6">
                  {ordenacao === "rating"
                    ? "As lojas mais bem avaliadas da rua:"
                    : "As lojas com mais seguidores da rua:"}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
                  {lojasExibidas.map((loja) => (
                    <div 
                      key={loja.id}
                      onClick={() => navigate(`/loja/${loja.id}`)}
                      className="flex flex-col items-center gap-2 hover:text-vermelho-pimenta focus:text-vermelho-pimenta transition-colors cursor-pointer">
                      <NewPredioLoja loja={loja} />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          loja.isOpen
                            ? "bg-green-50 text-green-700"
                            : "bg-marrom-rustico/10 text-marrom-rustico/50"
                        }`}
                      >
                        ● {loja.isOpen ? "Aberto" : "Fechado"}
                      </span>
                      <button
                        onClick={() => navigate(`/loja/${loja.id}`)}
                        className="text-[11px] font-bold uppercase tracking-wide text-marrom-rustico/50 hover:text-vermelho-pimenta focus:text-vermelho-pimenta transition-colors cursor-pointer"
                      >
                        Visitar loja →
                      </button>
                    </div>
                  ))}
                </div>

                <FaixaDeCalcada />
              </>
            )}
          </div>
        </div>
      </div>
    )
}