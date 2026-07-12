import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BotaoPrincipal } from "../components/BotaoPrincipal";
import { NewPredioLoja, type LojaData } from "../components/PredioLoja";

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
  const [erro, setErro] = useState("");
  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);
  const [nomeLojaRemover, setNomeLojaRemover] = useState("");
  const [erroRemover, setErroRemover] = useState("");
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    const buscarLojas = async () => {
      setLoading(true);
      setErro("");

      const user = JSON.parse(localStorage.getItem("Panelinha_user") || "{}");
      const userId = user.id || user.email || null;

      try {
        const url = userId
          ? `http://localhost:8000/api/lojas/?userId=${encodeURIComponent(userId)}`
          : "http://localhost:8000/api/lojas/";

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Não foi possível carregar suas lojas.");
        }

        const data = await res.json();
        setLojasDoUsuario(data);
      } catch (err: any) {
        console.error("Erro ao buscar lojas:", err);
        setErro(err.message || "Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    buscarLojas();
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

  const fecharModalRemover = () => {
    setModalRemoverAberto(false);
    setNomeLojaRemover("");
    setErroRemover("");
  };

  const removerLoja = async () => {
    setErroRemover("");

    const loja = lojasDoUsuario.find(
      (l) => l.name.trim().toLowerCase() === nomeLojaRemover.trim().toLowerCase()
    );

    if (!loja) {
      setErroRemover("Nenhuma loja sua com esse nome foi encontrada. Digite o nome exatamente como aparece.");
      return;
    }

    const confirmado = window.confirm(
      `Tem certeza que deseja excluir permanentemente a loja "${loja.name}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    try {
      setRemovendo(true);

      const res = await fetch(`http://localhost:8000/api/lojas/${loja.id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      setLojasDoUsuario((prev) => prev.filter((l) => l.id !== loja.id));
      fecharModalRemover();
    } catch {
      setErroRemover("Erro ao remover a loja. Tente novamente.");
    } finally {
      setRemovendo(false);
    }
  };

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

        <div className="shrink-0 flex flex-col sm:flex-row gap-2">
          <BotaoPrincipal
            texto="+ Inaugurar Nova Loja"
            onClick={() => navigate("/cadastro-loja")}
          />
          <button
            onClick={() => {
              setNomeLojaRemover("");
              setErroRemover("");
              setModalRemoverAberto(true);
            }}
            className="justify-center items-center text-center text-red-500 text-sm font-semibold bg-red-50 p-2 rounded-xl border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
            type="button"
          >
            Remover Loja
          </button>
        </div>
      </div>

      {erro && (
        <p className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl border border-red-200">
          {erro}
        </p>
      )}

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

      {/* MODAL DE REMOÇÃO */}
      {modalRemoverAberto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={fecharModalRemover}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-[#2A1F14] mb-2">
              Remover Loja
            </h2>
            <p className="text-sm text-[#6B5040] mb-4">
              Essa ação é <strong>permanente</strong>. Pra confirmar, digite o
              nome exato da loja que deseja excluir.
            </p>

            <label htmlFor="nomeLojaRemover" className="text-xs font-bold uppercase text-marrom-rustico/70">
              Nome da loja:
            </label>
            <input
              id="nomeLojaRemover"
              type="text"
              autoFocus
              value={nomeLojaRemover}
              onChange={(e) => setNomeLojaRemover(e.target.value)}
              placeholder="Ex: Pizzaria do Zé"
              className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-red-400 mt-1"
            />

            {erroRemover && (
              <p className="text-red-500 text-xs font-semibold mt-2">
                {erroRemover}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={fecharModalRemover}
                disabled={removendo}
                className="flex-1 py-2 rounded-xl border border-marrom-rustico/20 text-sm font-bold text-marrom-rustico/70 hover:bg-marrom-rustico/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={removerLoja}
                disabled={!nomeLojaRemover.trim() || removendo}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {removendo ? "Removendo..." : "Confirmar Exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};