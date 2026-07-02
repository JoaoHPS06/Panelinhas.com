export interface RespostaForum {
  id: string;
  autor: string;
  avatar: string;
  texto: string;
  data: string;
}

export interface TopicoForum {
  id: string;
  autor: string;
  avatar: string;
  titulo: string;
  texto: string;
  data: string;
  respostas: RespostaForum[];
}

interface LojaComunidadeProps {
  topicos: TopicoForum[];
}

export const LojaComunidade = ({ topicos }: LojaComunidadeProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">
            Fórum da Comunidade
          </h2>
          <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">
            Troque ideias, faça perguntas e interaja com outros clientes
          </p>
        </div>
        <button className="bg-amarelo-mostarda text-marrom-rustico hover:bg-[#E5A800] transition-colors font-bold px-5 py-2.5 rounded-full shadow-sm text-sm cursor-pointer">
          + Novo Tópico
        </button>
      </div>

      {topicos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
          <p className="text-cafe-expresso/50 font-medium">Nenhum tópico criado ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {topicos.map((topico) => (
            <div key={topico.id} className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(45,26,13,0.03)] border border-creme-suave">
              
              {/* Pergunta Principal */}
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-areia/40 rounded-full flex items-center justify-center text-xl">
                  {topico.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-extrabold text-marrom-rustico text-base">{topico.autor}</h4>
                    <span className="text-xs font-semibold text-cafe-expresso/40 uppercase">{topico.data}</span>
                  </div>
                  <h3 className="font-bold text-cafe-expresso text-lg mb-2">{topico.titulo}</h3>
                  <p className="text-cafe-expresso/80 text-sm leading-relaxed mb-4">{topico.texto}</p>
                  
                  <button className="text-xs font-bold text-verde-salvia hover:text-verde-salvia/70 transition-colors uppercase tracking-wider cursor-pointer mb-2">
                    Responder
                  </button>
                </div>
              </div>

              {/* Área de Respostas (Aninhada) */}
              {topico.respostas.length > 0 && (
                <div className="mt-4 ml-6 md:ml-16 pl-4 border-l-2 border-areia/60 space-y-4">
                  {topico.respostas.map((resposta) => (
                    <div key={resposta.id} className="flex gap-3 bg-areia/10 p-4 rounded-xl border border-areia/20">
                      <div className="w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center text-sm shadow-sm">
                        {resposta.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-bold text-marrom-rustico text-sm">{resposta.autor}</h5>
                          <span className="text-[10px] font-semibold text-cafe-expresso/40 uppercase">{resposta.data}</span>
                        </div>
                        <p className="text-cafe-expresso/70 text-sm">{resposta.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};