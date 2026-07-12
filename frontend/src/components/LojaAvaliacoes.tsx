import { useState, useEffect } from "react";

interface LojaAvaliacoesProps {
  idLoja: number | string;
  isOwner?: boolean;
}

interface Avaliacao {
  id: number;
  nome_usuario: string;
  nota: number;
  comentario: string;
  criado_em: string;
}

export const LojaAvaliacoes = ({ idLoja, isOwner }: LojaAvaliacoesProps) => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);

  // Estados para o formulário de nova avaliação
  const [nota, setNota] = useState<number>(0);
  const [hoverNota, setHoverNota] = useState<number>(0);
  const [comentario, setComentario] = useState("");
  const [loadingEnvio, setLoadingEnvio] = useState(false);

  const userString = localStorage.getItem("Panelinha_user");
  const token = userString ? JSON.parse(userString).access : null;

  const buscarAvaliacoes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/avaliacoes/?loja=${idLoja}`);
      if (res.ok) {
        const data = await res.json();
        setAvaliacoes(data);
      }
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err);
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  useEffect(() => {
    buscarAvaliacoes();
  }, [idLoja]);

  const handleAvaliar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
    if (nota === 0) {
      alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoadingEnvio(true);
    try {
      const res = await fetch("http://localhost:8000/api/avaliacoes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          loja: idLoja,
          nota: nota,
          comentario: comentario
        })
      });

      if (res.ok) {
        setNota(0);
        setComentario("");
        buscarAvaliacoes(); // Atualiza a lista
      } else {
        const errorData = await res.json();
        // O Django pode retornar erro se o usuário for dono de loja (como configuramos no views.py) 
        // ou se já tiver avaliado essa loja (unique_together no models.py)
        alert(errorData.detail || errorData.non_field_errors?.[0] || "Erro ao enviar avaliação.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setLoadingEnvio(false);
    }
  };

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Calcula a média visual rapidamente
  const media = avaliacoes.length > 0 
    ? (avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoes.length).toFixed(1)
    : "0.0";

  if (loadingAvaliacoes) return <div className="text-center py-10">Carregando avaliações...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      {/* CABEÇALHO DE RESUMO DAS AVALIAÇÕES */}
      <div className="flex items-center gap-6 mb-10 bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8D0]">
        <div className="flex flex-col items-center justify-center bg-[#FAF7F4] w-32 h-32 rounded-2xl border border-[#E2D8D0]">
          <span className="text-4xl font-black text-[#2A1F14]">{media}</span>
          <div className="flex text-[#D85A30] text-sm mt-1">
            {"★".repeat(Math.round(Number(media)))}{"☆".repeat(5 - Math.round(Number(media)))}
          </div>
          <span className="text-xs text-[#8C7361] mt-2 font-bold">{avaliacoes.length} avaliações</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#2A1F14] mb-2">O que os clientes dizem</h2>
          <p className="text-[#8C7361] text-sm">As avaliações ajudam a comunidade a encontrar os melhores produtos e serviços na Rua Principal.</p>
        </div>
      </div>

      {/* FORMULÁRIO DE AVALIAÇÃO (Apenas para Clientes) */}
      {!isOwner && (
        <form onSubmit={handleAvaliar} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8D0] mb-10 transition-all focus-within:border-[#D85A30]">
          <h3 className="font-black text-lg text-[#2A1F14] mb-4">Deixe sua avaliação</h3>
          
          {/* Seletor de Estrelas Interativo */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverNota(star)}
                onMouseLeave={() => setHoverNota(0)}
                onClick={() => setNota(star)}
                className="text-3xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                style={{ color: (hoverNota || nota) >= star ? "#D85A30" : "#E2D8D0" }}
              >
                ★
              </button>
            ))}
            <span className="ml-3 text-sm font-bold text-[#8C7361] self-center">
              {nota > 0 ? `${nota} estrela${nota > 1 ? 's' : ''}` : "Clique para dar uma nota"}
            </span>
          </div>

          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte um pouco sobre a sua experiência com esta loja..."
            className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 outline-none focus:border-[#D85A30] resize-none h-24 mb-3 text-[#4A3A2F]"
            required
          />
          
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={loadingEnvio}
              className="bg-[#2A1F14] text-white font-bold px-8 py-2.5 rounded-xl hover:bg-[#4A3A2F] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingEnvio ? "Enviando..." : "Publicar Avaliação"}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE AVALIAÇÕES */}
      <div className="space-y-4">
        {avaliacoes.length === 0 ? (
          <div className="text-center py-8 text-[#8C7361]">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </div>
        ) : (
          avaliacoes.map((av) => (
            <div key={av.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8D0]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black uppercase">
                    {av.nome_usuario.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[#2A1F14] block leading-none mb-1">{av.nome_usuario}</span>
                    <span className="text-xs text-[#8C7361]">{formatarData(av.criado_em)}</span>
                  </div>
                </div>
                <div className="flex text-[#D85A30] text-lg">
                  {"★".repeat(av.nota)}{"☆".repeat(5 - av.nota)}
                </div>
              </div>
              <p className="text-[#4A3A2F]">{av.comentario}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};