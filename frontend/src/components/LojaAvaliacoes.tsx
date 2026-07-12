import { useState, useEffect } from "react";

interface AvaliacaoBackend {
  id: number;
  nome_usuario: string; // Mapeado do serializer do Django
  nota: number;
  comentario: string;
  criado_em: string;
}

interface LojaAvaliacoesProps {
  idLoja: number;
}

export const LojaAvaliacoes = ({ idLoja }: LojaAvaliacoesProps) => {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoBackend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarAvaliacoes = async () => {
      try {
        // Filtra as avaliações passando o id da loja via query string
        const resposta = await fetch(`http://localhost:8000/api/avaliacoes/?loja=${idLoja}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setAvaliacoes(dados);
        }
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarAvaliacoes();
  }, [idLoja]);

  if (loading) return <div className="text-center py-12 text-cafe-expresso/50 font-bold animate-pulse">Carregando avaliações...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10 flex items-center justify-between border-b border-cafe-expresso/10 pb-6">
        <div>
          <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">Avaliações da Comunidade</h2>
          <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">O que estão achando deste estabelecimento</p>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
          <p className="text-cafe-expresso/50 font-medium">Nenhuma avaliação encontrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {avaliacoes.map((av) => (
            <div key={av.id} className="bg-white p-6 rounded-2xl shadow-sm border border-creme-suave">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-areia/30 rounded-full flex items-center justify-center text-xl font-bold text-marrom-rustico">
                    {av.nome_usuario[0]?.toUpperCase() || "👤"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-marrom-rustico text-base">{av.nome_usuario}</h4>
                    <span className="text-xs font-semibold text-cafe-expresso/50 uppercase">
                      {new Date(av.criado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                <div className="text-amarelo-mostarda text-lg tracking-widest">
                  {'★'.repeat(av.nota)}{'☆'.repeat(5 - av.nota)}
                </div>
              </div>
              <p className="text-cafe-expresso/80 text-sm leading-relaxed">"{av.comentario}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};