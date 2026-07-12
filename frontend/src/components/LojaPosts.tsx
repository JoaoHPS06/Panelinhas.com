import { useState, useEffect } from "react";

interface PostBackend {
  id: number;
  texto: string;
  criado_em: string;
}

interface LojaPostsProps {
  idLoja: number;
}

export const LojaPosts = ({ idLoja }: LojaPostsProps) => {
  const [posts, setPosts] = useState<PostBackend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarPosts = async () => {
      try {
        const resposta = await fetch(`http://localhost:8000/api/posts/?loja=${idLoja}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setPosts(dados);
        }
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarPosts();
  }, [idLoja]);

  if (loading) return <div className="text-center py-12 text-cafe-expresso/50 font-bold animate-pulse">Carregando posts...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">Mural da Loja</h2>
        <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">Acompanhe as novidades e postagens da gerência</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
          <p className="text-cafe-expresso/50 font-medium">Nenhuma postagem oficial ainda.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-creme-suave p-6">
              <div className="flex items-center justify-between mb-4 border-b border-areia/20 pb-3">
                <span className="text-xs font-bold text-cafe-expresso/40 uppercase tracking-widest">
                  {new Date(post.criado_em).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-lg">📢</span>
              </div>
              <p className="text-cafe-expresso text-sm leading-relaxed font-medium">{post.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};