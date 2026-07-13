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

/** Faixa fina de calçada */
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
  const [lojasProprias, setLojasProprias] = useState<LojaData[]>([]);
  const [lojasSeguidas, setLojasSeguidas] = useState<LojaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<"proprias" | "seguidas">("seguidas");

  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);
  const [nomeLojaRemover, setNomeLojaRemover] = useState("");
  const [erroRemover, setErroRemover] = useState("");
  const [removendo, setRemovendo] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);

  useEffect(() => {
    buscarLojas();
  }, []);

  const getToken = () => {
    const userString = localStorage.getItem("Panelinha_user");
    return userString ? JSON.parse(userString).access : null;
  };

  const buscarLojas = async () => {
    setLoading(true);
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      // Dispara as duas requisições ao mesmo tempo para carregar mais rápido
      const [resProprias, resSeguidas] = await Promise.all([
        fetch("http://localhost:8000/api/lojas/minhas_lojas/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/lojas/seguidas/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resProprias.ok && resSeguidas.ok) {
        const dadosProprias = await resProprias.json();
        const dadosSeguidas = await resSeguidas.json();

        // Traduz o JSON do Django para o formato do Componente React
        const adaptarLoja = (d: any): LojaData => ({
          id: d.id,
          name: d.nome,
          category: d.categoria,
          emoji: d.emoji || "🏪",
          rating: d.nota_media || 5.0,
          followers: d.total_seguidores || 0,
          isOpen: d.esta_aberta ?? true,
          windows: d.janelas || [true, false, true],
          primary: d.cor_primaria || "#D85A30",
          secondary: d.cor_secundaria || "#FAF7F4",
        });

        setLojasProprias(dadosProprias.map(adaptarLoja));
        setLojasSeguidas(dadosSeguidas.map(adaptarLoja));
      }
    } catch (error) {
      console.error("Erro ao buscar as lojas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fecharModalRemover = () => {
    setModalRemoverAberto(false);
    setNomeLojaRemover("");
    setErroRemover("");
  };

  const removerLoja = async () => {
    setErroRemover("");

    const loja = lojasProprias.find(
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
      const token = getToken();

      const res = await fetch(`http://localhost:8000/api/lojas/${loja.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error();
      }

      setLojasProprias((prev) => prev.filter((l) => l.id !== loja.id));
      fecharModalRemover();
    } catch {
      setErroRemover("Erro ao remover a loja. Tente novamente.");
    } finally {
      setRemovendo(false);
    }
  };

  const listaExibida = abaAtiva === "proprias" ? lojasProprias : lojasSeguidas;

  const totalSeguidores = listaExibida.reduce((acc, loja) => acc + loja.followers, 0);
  const mediaAvaliacao = listaExibida.length
    ? (listaExibida.reduce((acc, loja) => acc + loja.rating, 0) / listaExibida.length).toFixed(1)
    : "0.0";

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
            Minhas Lojas
          </h1>
          <p className="text-[#6B5040] text-sm mt-1">
            Gerencie seus negócios ou acompanhe seus estabelecimentos favoritos.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-2">
          <BotaoPrincipal
            texto="+ Inaugurar Nova Loja"
            onClick={() => navigate("/cadastro-loja")}
          />
          {abaAtiva === "proprias" && lojasProprias.length > 0 && (
            <button
              onClick={() => setModalEditarAberto(true)}
              className="justify-center items-center text-center text-blue-500 text-sm font-semibold bg-blue-50 p-2 rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
              type="button"
            >
              Editar Loja
            </button>
          )}
          {abaAtiva === "proprias" && lojasProprias.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className="flex gap-4 border-b border-marrom-rustico/10">
        <button
          onClick={() => setAbaAtiva("seguidas")}
          className={`pb-3 text-sm font-bold uppercase tracking-wide transition-colors duration-300 relative cursor-pointer ${
            abaAtiva === "seguidas" ? "text-marrom-rustico" : "text-marrom-rustico/40 hover:text-marrom-rustico/70"
          }`}
        >
          ⭐ Lojas que Sigo ({lojasSeguidas.length})
          {abaAtiva === "seguidas" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-marrom-rustico rounded-t-md"></div>
          )}
        </button>
        <button
          onClick={() => setAbaAtiva("proprias")}
          className={`pb-3 text-sm font-bold uppercase tracking-wide transition-colors duration-300 relative cursor-pointer ${
            abaAtiva === "proprias" ? "text-marrom-rustico" : "text-marrom-rustico/40 hover:text-marrom-rustico/70"
          }`}
        >
          🏪 Meus Negócios ({lojasProprias.length})
          {abaAtiva === "proprias" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-marrom-rustico rounded-t-md"></div>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-marrom-rustico/10 p-5 rounded-2xl shadow-sm h-19 animate-pulse" />
            ))}
          </div>
          <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
              {[1, 2, 3, 4].map((i) => <BuildingSkeleton key={i} />)}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Métricas da Aba Ativa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4" style={{ borderTopColor: "#D85A30" }}>
              <span className="text-3xl bg-creme-suave p-3 rounded-xl">🏢</span>
              <div>
                <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">Total nesta lista</p>
                <p className="text-2xl font-black text-cafe-expresso">{listaExibida.length}</p>
              </div>
            </div>
            <div className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4" style={{ borderTopColor: "#3F7FD1" }}>
              <span className="text-3xl bg-creme-suave p-3 rounded-xl">👥</span>
              <div>
                <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">Seguidores (Soma)</p>
                <p className="text-2xl font-black text-cafe-expresso">{totalSeguidores}</p>
              </div>
            </div>
            <div className="bg-white border border-marrom-rustico/10 border-t-[3px] p-5 rounded-2xl shadow-sm flex items-center gap-4" style={{ borderTopColor: "#C99020" }}>
              <span className="text-3xl bg-creme-suave p-3 rounded-xl">⭐</span>
              <div>
                <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">Média de Avaliações</p>
                <p className="text-2xl font-black text-cafe-expresso">{mediaAvaliacao} <span className="text-xs font-normal text-marrom-rustico/60">/ 5.0</span></p>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner relative overflow-hidden min-h-100">
            {listaExibida.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                <span className="text-5xl block mb-4">{abaAtiva === "proprias" ? "🏪" : "🚶"}</span>
                <h3 className="text-lg font-bold text-[#2A1F14] mb-1">
                  {abaAtiva === "proprias" ? "Você ainda não inaugurou nenhuma loja" : "Você não segue nenhuma loja"}
                </h3>
                <p className="text-[#6B5040] text-sm mb-6 max-w-sm">
                  {abaAtiva === "proprias" 
                    ? "Abra as portas do seu negócio para a comunidade da rua virtual hoje mesmo." 
                    : "Explore a rua principal e acompanhe as novidades dos seus estabelecimentos favoritos."}
                </p>
                <BotaoPrincipal
                  texto={abaAtiva === "proprias" ? "Construir minha fachada" : "Explorar a rua"}
                  onClick={() => navigate(abaAtiva === "proprias" ? "/cadastro-loja" : "/")}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center relative z-10">
                {listaExibida.map((loja) => (
                  <div key={loja.id} className="flex flex-col items-center gap-2 group cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => navigate(`/loja/${loja.id}`)}>
                    <NewPredioLoja loja={loja} />
                    <button className="text-[11px] font-bold uppercase tracking-wide text-marrom-rustico/50 group-hover:text-vermelho-pimenta transition-colors mt-1">
                      {abaAtiva === "proprias" ? "Gerenciar →" : "Visitar →"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <FaixaDeCalcada />
          </div>
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

      {/* MODAL DE EDIÇÃO */}
      {modalEditarAberto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalEditarAberto(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold text-[#2A1F14] mb-2">
              Qual loja deseja editar?
            </h2>
            <p className="text-sm text-[#6B5040] mb-4">
              Selecione o estabelecimento para alterar fachada, nome, cores ou endereço.
            </p>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {lojasProprias.map((loja) => (
                <button
                  key={loja.id}
                  onClick={() => navigate(`/editar-loja/${loja.id}`)}
                  className="flex items-center gap-4 bg-[#FAF7F4] border border-[#E2D8D0] p-3 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer text-left w-full"
                >
                  <span className="text-2xl">{loja.emoji}</span>
                  <div>
                    <span className="block font-bold text-[#2A1F14]">{loja.name}</span>
                    <span className="text-xs text-[#8C7361]">{loja.category}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModalEditarAberto(false)}
              className="w-full mt-6 py-2 rounded-xl border border-marrom-rustico/20 text-sm font-bold text-marrom-rustico/70 hover:bg-marrom-rustico/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};