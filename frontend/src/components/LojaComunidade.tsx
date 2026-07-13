import { useState, useEffect } from "react";

interface LojaComunidadeProps {
  idLoja: number | string;
  isOwner?: boolean;
}

interface Pergunta {
  id: number;
  nome_autor: string;
  texto_pergunta: string;
  texto_resposta: string | null;
  criado_em: string;
  respondido_em: string | null;
}

export const LojaComunidade = ({ idLoja, isOwner }: LojaComunidadeProps) => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  // Estado para a pergunta do cliente
  const [novaPergunta, setNovaPergunta] = useState("");
  const [loadingPergunta, setLoadingPergunta] = useState(false);

  // Estado para controlar os textos de resposta do dono (separados por ID da pergunta)
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [loadingResposta, setLoadingResposta] = useState<number | null>(null);

  // Estado para edição de uma resposta já publicada
  const [respostaEditandoId, setRespostaEditandoId] = useState<number | null>(null);
  const [textoEdicaoResposta, setTextoEdicaoResposta] = useState("");
  const [loadingEdicaoResposta, setLoadingEdicaoResposta] = useState(false);

  const userString = localStorage.getItem("Panelinha_user");
  const token = userString ? JSON.parse(userString).access : null;

  const buscarPerguntas = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/perguntas/?loja=${idLoja}`);
      if (res.ok) {
        const data = await res.json();
        setPerguntas(data);
      }
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    buscarPerguntas();
  }, [idLoja]);

  // Função para um cliente enviar uma nova pergunta
  const handlePerguntar = async () => {
    if (!novaPergunta.trim()) return;
    if (!token) {
        alert("Você precisa estar logado para fazer uma pergunta.");
        return;
    }

    setLoadingPergunta(true);
    try {
      const res = await fetch("http://localhost:8000/api/perguntas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          loja: idLoja,
          texto_pergunta: novaPergunta
        })
      });

      if (res.ok) {
        setNovaPergunta("");
        buscarPerguntas();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Erro ao enviar a pergunta.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setLoadingPergunta(false);
    }
  };

  // Função para o dono da loja responder uma pergunta
  const handleResponder = async (idPergunta: number) => {
    const texto = respostas[idPergunta];
    if (!texto || !texto.trim()) return;

    setLoadingResposta(idPergunta);
    try {
      const res = await fetch(`http://localhost:8000/api/perguntas/${idPergunta}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          texto_resposta: texto
        })
      });

      if (res.ok) {
        // Limpa a caixa de texto da resposta específica e recarrega a lista
        setRespostas({ ...respostas, [idPergunta]: "" });
        buscarPerguntas();
      } else {
        alert("Erro ao enviar a resposta.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setLoadingResposta(null);
    }
  };

  // Abre o modo de edição de uma resposta já publicada
  const iniciarEdicaoResposta = (pergunta: Pergunta) => {
    setRespostaEditandoId(pergunta.id);
    setTextoEdicaoResposta(pergunta.texto_resposta || "");
  };

  const cancelarEdicaoResposta = () => {
    setRespostaEditandoId(null);
    setTextoEdicaoResposta("");
  };

  const handleSalvarEdicaoResposta = async (idPergunta: number) => {
    if (!textoEdicaoResposta.trim()) return;

    setLoadingEdicaoResposta(true);
    try {
      const res = await fetch(`http://localhost:8000/api/perguntas/${idPergunta}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ texto_resposta: textoEdicaoResposta })
      });

      if (res.ok) {
        setPerguntas(prev => prev.map(p => p.id === idPergunta ? { ...p, texto_resposta: textoEdicaoResposta } : p));
        cancelarEdicaoResposta();
      } else {
        alert("Erro ao salvar a edição da resposta.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoadingEdicaoResposta(false);
    }
  };

  const handleRemoverPergunta = async (idPergunta: number) => {
  if (!confirm("Deseja mesmo apagar esta pergunta?")) return;

  const token = JSON.parse(localStorage.getItem("Panelinha_user") || "{}").access;

  try {
    const res = await fetch(`http://localhost:8000/api/perguntas/${idPergunta}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      // Remove a pergunta da lista filtrando pelo ID
      setPerguntas(prev => prev.filter(p => p.id !== idPergunta));
    }
  } catch (err) {
    alert("Erro ao remover pergunta.");
  }
};

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loadingPosts) return <div className="text-center py-10">Carregando perguntas...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      {/* CAIXA DE NOVA PERGUNTA - Só aparece se NÃO for o dono */}
      {!isOwner && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8D0] mb-10">
          <h3 className="font-black text-xl text-[#2A1F14] mb-2">Tem alguma dúvida?</h3>
          <p className="text-[#8C7361] text-sm mb-4">Pergunte sobre produtos, horários ou encomendas diretamente ao lojista.</p>
          
          <div className="flex gap-3">
            <textarea
              value={novaPergunta}
              onChange={(e) => setNovaPergunta(e.target.value)}
              placeholder="Escreva sua pergunta aqui..."
              className="flex-1 bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 outline-none focus:border-[#D85A30] resize-none h-14"
            />
            <button 
              onClick={handlePerguntar}
              disabled={loadingPergunta || !novaPergunta.trim()}
              className="bg-[#2A1F14] text-white font-bold px-6 rounded-xl hover:bg-[#4A3A2F] transition-colors disabled:opacity-50 cursor-pointer h-14"
            >
              {loadingPergunta ? "Enviando..." : "Perguntar"}
            </button>
          </div>
        </div>
      )}

      {/* LISTA DE PERGUNTAS E RESPOSTAS */}
      <h2 className="text-xl font-black text-[#2A1F14] mb-6">Perguntas da Comunidade</h2>

      <div className="space-y-6">
        {perguntas.length === 0 ? (
          <div className="text-center py-12 text-[#8C7361] bg-white rounded-3xl border border-dashed border-[#E2D8D0]">
            <span className="text-4xl block mb-3 opacity-50">💬</span>
            Ainda não há perguntas para esta loja.
          </div>
        ) : (
          perguntas.map((pergunta) => (
            <div key={pergunta.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8D0]">
              
              {/* BLOCO DA PERGUNTA */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center font-black uppercase shrink-0">
                  {pergunta.nome_autor.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#2A1F14]">{pergunta.nome_autor}</span>
                    <span className="text-xs text-[#8C7361]">• {formatarData(pergunta.criado_em)}</span>
                  </div>
                  <p className="text-[#4A3A2F]">{pergunta.texto_pergunta}</p>
                </div>
              </div>

              {/* BLOCO DA RESPOSTA */}
              <div className="mt-4 ml-14">
                {pergunta.texto_resposta ? (
                  respostaEditandoId === pergunta.id ? (
                    // MODO DE EDIÇÃO DA RESPOSTA
                    <div>
                      <textarea
                        value={textoEdicaoResposta}
                        onChange={(e) => setTextoEdicaoResposta(e.target.value)}
                        className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 outline-none focus:border-[#D85A30] text-sm resize-none mb-2"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSalvarEdicaoResposta(pergunta.id)}
                          disabled={loadingEdicaoResposta || !textoEdicaoResposta.trim()}
                          className="bg-[#D85A30] text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-[#C24B24] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {loadingEdicaoResposta ? "Salvando..." : "Salvar"}
                        </button>
                        <button 
                          onClick={cancelarEdicaoResposta}
                          disabled={loadingEdicaoResposta}
                          className="text-sm font-bold text-[#8C7361] hover:text-[#2A1F14] px-4 py-1.5 cursor-pointer disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Se já foi respondido, mostra a resposta da loja
                    <div className="bg-[#FAF7F4] p-4 rounded-2xl rounded-tl-none border border-[#E2D8D0] relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-[#FAF7F4] border-l border-t border-[#E2D8D0] transform -translate-x-1/2 -rotate-45 skew-x-12 hidden md:block"></div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#D85A30]">Resposta da Loja</span>
                          <span className="text-xs text-[#8C7361]">• {formatarData(pergunta.respondido_em || pergunta.criado_em)}</span>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() => iniciarEdicaoResposta(pergunta)}
                            className="text-[10px] font-bold text-[#8C7361] hover:text-[#D85A30] uppercase cursor-pointer shrink-0"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                      <p className="text-[#4A3A2F] text-sm">{pergunta.texto_resposta}</p>
                    </div>
                  )
                ) : (
                  // Se não foi respondido ainda...
                  isOwner ? (
                    // O DONO vê o campo para responder
                    <div className="mt-2">
                      <textarea
                        value={respostas[pergunta.id] || ""}
                        onChange={(e) => setRespostas({ ...respostas, [pergunta.id]: e.target.value })}
                        placeholder="Escreva a resposta para o cliente..."
                        className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 outline-none focus:border-[#D85A30] text-sm resize-none mb-2"
                        rows={2}
                      />
                      <button 
                        onClick={() => handleResponder(pergunta.id)}
                        disabled={loadingResposta === pergunta.id || !respostas[pergunta.id]?.trim()}
                        className="bg-[#D85A30] text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-[#C24B24] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loadingResposta === pergunta.id ? "Respondendo..." : "Responder"}
                      </button>
                    </div>
                  ) : (
                    // OS CLIENTES veem o aviso de que está pendente
                    <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-200">
                      <span>⏳</span> Aguardando resposta da loja...
                    </div>
                  )
                )}
              </div>

              {isOwner && (
                <button 
                  onClick={() => handleRemoverPergunta(pergunta.id)}
                  className="text-[10px] text-red-400 font-bold uppercase hover:text-red-600 cursor-pointer mt-2"
                >
                  Excluir Pergunta
                </button>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
};