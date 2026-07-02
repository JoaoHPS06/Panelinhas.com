// 1. O contrato de dados de uma avaliação individual
export interface Avaliacao {
  id: string;
  autor: string;
  avatar: string; // Emoji ou iniciais
  nota: number;   // De 1 a 5
  data: string;
  comentario: string;
}

interface LojaAvaliacoesProps {
  avaliacoes: Avaliacao[];
}

export const LojaAvaliacoes = ({ avaliacoes }: LojaAvaliacoesProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      {/* Cabeçalho da Seção */}
      <div className="mb-10 flex items-center justify-between border-b border-cafe-expresso/10 pb-6">
        <div>
          <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">
            Avaliações da Comunidade
          </h2>
          <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">
            O que estão achando deste estabelecimento
          </p>
        </div>
        
        {/* Resumo da Nota */}
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-1 text-2xl text-amarelo-mostarda">
            ★★★★★
          </div>
          <span className="text-cafe-expresso/80 font-bold text-sm mt-1">
            4.8 de 5.0
          </span>
        </div>
      </div>

      {/* Lista de Comentários */}
      {avaliacoes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
          <p className="text-cafe-expresso/50 font-medium">
            Nenhuma avaliação encontrada ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {avaliacoes.map((av) => (
            <div 
              key={av.id} 
              className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(45,26,13,0.03)] border border-white/60 hover:shadow-[0_8px_24px_rgba(45,26,13,0.06)] transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                
                {/* Perfil do Avaliador */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-areia/30 rounded-full flex items-center justify-center text-xl border border-areia/50 shadow-sm">
                    {av.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-marrom-rustico text-base">
                      {av.autor}
                    </h4>
                    <span className="text-xs font-semibold text-cafe-expresso/50 uppercase tracking-wider">
                      {av.data}
                    </span>
                  </div>
                </div>

                {/* Renderização Dinâmica das Estrelas */}
                <div className="text-amarelo-mostarda text-lg tracking-widest drop-shadow-sm">
                  {'★'.repeat(av.nota)}{'☆'.repeat(5 - av.nota)}
                </div>

              </div>
              
              {/* Texto da Avaliação */}
              <p className="text-cafe-expresso/80 text-sm leading-relaxed">
                "{av.comentario}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};