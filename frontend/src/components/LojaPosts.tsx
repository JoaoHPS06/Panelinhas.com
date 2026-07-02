export interface PostLoja {
  id: string;
  conteudoVisual: string; // Pode ser um emoji gigante para simular uma foto
  texto: string;
  data: string;
  curtidas: number;
}

interface LojaPostsProps {
  posts: PostLoja[];
}

export const LojaPosts = ({ posts }: LojaPostsProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">
          Mural da Loja
        </h2>
        <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">
          Acompanhe as novidades e postagens
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
          <p className="text-cafe-expresso/50 font-medium">Nenhuma postagem ainda.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(45,26,13,0.04)] border border-creme-suave">
              
              {/* "Foto" do Post */}
              <div className="h-64 bg-linear-to-br from-areia/40 to-amarelo-mostarda/20 flex items-center justify-center text-8xl">
                {post.conteudoVisual}
              </div>
              
              {/* Rodapé do Post (Texto e Ações) */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cafe-expresso/40 uppercase tracking-widest">
                    {post.data}
                  </span>
                  
                  {/* Botão de Curtir Fictício */}
                  <button className="flex items-center gap-1.5 text-vermelho-pimenta/80 hover:text-vermelho-pimenta transition-colors cursor-pointer font-bold text-sm">
                    <span>♥</span> {post.curtidas}
                  </button>
                </div>
                
                <p className="text-cafe-expresso text-sm leading-relaxed font-medium">
                  {post.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};