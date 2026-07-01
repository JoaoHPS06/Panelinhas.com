import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BotaoPrincipal } from "../components/BotaoPrincipal";
import { NewPredioLoja, type LojaData } from "../components/PredioLoja";

const LOJAS_MOCK: LojaData[] = [
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
    description: "A melhor pizza de fermentação natural da rua virtual!",
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
    description: "Pães quentinhos e doces artesanais saindo a toda hora.",
  },
];

/** Esqueleto no formato de um prédio, exibido enquanto a lista carrega */
const BuildingSkeleton = () => (
  <div className="w-40.5 flex flex-col items-center gap-2 animate-pulse">
    <div className="w-40.5 h-7 rounded-t-md bg-marrom-rustico/15" />
    <div className="w-40.5 h-27 rounded-t-md bg-marrom-rustico/10" />
    <div className="w-40.5 h-7 rounded-b bg-marrom-rustico/10" />
  </div>
);

/** Faixa fina de calçada — repete a textura usada na Faixada, pra ligar essa tela ao cenário de rua */
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

export const MinhasLojas = () => {
  const navigate = useNavigate();
  const [lojasDoUsuario, setLojasDoUsuario] = useState<LojaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setLojasDoUsuario(LOJAS_MOCK);
      setLoading(false);
    }, 800);

    return () => clearTimeout(temporizador);
  }, []);

  const totalSeguidores = lojasDoUsuario.reduce(
    (acc, loja) => acc + loja.followers,
    0,
  );
  const mediaAvaliacao = lojasDoUsuario.length
    ? (
        lojasDoUsuario.reduce((acc, loja) => acc + loja.rating, 0) /
        lojasDoUsuario.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-5xl mx-auto pt-20 px-6 pb-12 font-nunito min-h-screen space-y-8">
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
            Minhas Lojas
          </h1>
          <p className="text-[#6B5040] text-sm mt-1">
            Gerencie seus negócios e veja como eles aparecem na nossa rua
            virtual.
          </p>
        </div>

        <div className="shrink-0">
          <BotaoPrincipal
            texto="+ Inaugurar Nova Loja"
            onClick={() => navigate("/cadastro-loja")}
          />
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
            <span className="text-xs font-extrabold uppercase tracking-widest text-marrom-rustico/40 block mb-6">
              Construindo sua rua...
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
              {[1, 2, 3, 4].map((i) => (
                <BuildingSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {lojasDoUsuario.length === 0 ? (
            <div className="bg-white border border-marrom-rustico/10 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto mt-10">
              <span className="text-5xl block mb-4">🏪</span>
              <h3 className="text-lg font-bold text-[#2A1F14] mb-1">
                Sua calçada está vazia
              </h3>
              <p className="text-[#6B5040] text-sm mb-6">
                Você ainda não construiu nenhuma fachada na nossa rua virtual.
                Que tal inaugurar o seu primeiro prédio agora?
              </p>
              <BotaoPrincipal
                texto="Construir minha primeira loja"
                onClick={() => navigate("/cadastro-loja")}
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4"
                  style={{ borderTopColor: "#D85A30" }}
                >
                  <span className="text-3xl bg-creme-suave p-3 rounded-xl">
                    🏢
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">
                      Total de Lojas
                    </p>
                    <p className="text-2xl font-black text-cafe-expresso">
                      {lojasDoUsuario.length}
                    </p>
                  </div>
                </div>
                <div
                  className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4"
                  style={{ borderTopColor: "#3F7FD1" }}
                >
                  <span className="text-3xl bg-creme-suave p-3 rounded-xl">
                    👥
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">
                      Seguidores Totais
                    </p>
                    <p className="text-2xl font-black text-cafe-expresso">
                      {totalSeguidores}
                    </p>
                  </div>
                </div>
                <div
                  className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4"
                  style={{ borderTopColor: "#C99020" }}
                >
                  <span className="text-3xl bg-creme-suave p-3 rounded-xl">
                    ⭐
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">
                      Média de Avaliações
                    </p>
                    <p className="text-2xl font-black text-cafe-expresso">
                      {mediaAvaliacao}{" "}
                      <span className="text-xs font-normal text-marrom-rustico/60">
                        / 5.0
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner relative overflow-hidden">
                <span className="text-xs font-extrabold uppercase tracking-widest text-marrom-rustico/40 block mb-6">
                  Suas propriedades ativas na rua:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
                  {lojasDoUsuario.map((loja) => (
                    <div
                      key={loja.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <NewPredioLoja loja={loja} />
                      <button
                        onClick={() => navigate(`/loja/${loja.id}`)}
                        className="text-[11px] font-bold uppercase tracking-wide text-marrom-rustico/50 hover:text-vermelho-pimenta focus:text-vermelho-pimenta transition-colors cursor-pointer"
                      >
                        Gerenciar →
                      </button>
                    </div>
                  ))}
                </div>

                <FaixaDeCalcada />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
