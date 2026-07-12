import { useState, useEffect } from "react";
import { type LojaData } from "./PredioLoja.tsx";

interface LojaPostsProps {
  idLoja: number | string;
  isOwner?: boolean;
  loja?: LojaData;
}

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  criado_em: string;
}

export const LojaPosts = ({ idLoja, isOwner, loja }: LojaPostsProps) => {
  const [novoTexto, setNovoTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregandoPosts, setCarregandoPosts] = useState(true);

  const buscarPosts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/posts/?loja=${idLoja}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
    } finally {
      setCarregandoPosts(false);
    }
  };

  useEffect(() => {
    buscarPosts();
  }, [idLoja]);

  const handlePostar = async () => {
    if (!novoTexto.trim()) return;
    setLoading(true);

    const userString = localStorage.getItem("Panelinha_user");
    const token = userString ? JSON.parse(userString).access : null;

    try {
      const res = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          loja: idLoja,
          titulo: "Atualização da Loja", // Título padrão, já que o design tem apenas um campo de texto
          conteudo: novoTexto
        })
      });

      if (res.ok) {
        setNovoTexto("");
        buscarPosts(); // Recarrega os posts atualizados
      } else {
        alert("Erro ao publicar postagem.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  if (carregandoPosts) return <div className="text-center py-10">Carregando feed...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* CAIXA DE NOVA POSTAGEM */}
      {isOwner && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2D8D0] mb-8 transition-all focus-within:shadow-md focus-within:border-[#D85A30]">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#FAF7F4] border border-[#E2D8D0] rounded-full flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {loja?.emoji || "🏪"}
            </div>
            <div className="flex-1 flex flex-col">
              <textarea
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                placeholder="O que há de novo na sua loja? Divulgue ofertas, novidades ou avisos..."
                className="w-full bg-transparent resize-none outline-none text-[#2A1F14] placeholder:text-[#8C7361] min-h-15 pt-3"
              />
              {novoTexto && (
                <div className="flex justify-end mt-3 pt-3 border-t border-[#F3E5D8] animate-fade-in">
                  <button 
                    onClick={handlePostar}
                    disabled={loading}
                    className="bg-[#D85A30] text-white font-bold px-6 py-2 rounded-full hover:bg-[#C24B24] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Publicando..." : "Publicar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEED DE POSTAGENS */}
      <h2 className="text-xl font-black text-[#2A1F14] mb-6">Últimas Atualizações</h2>
      
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-10 text-[#8C7361] bg-white rounded-3xl border border-dashed border-[#E2D8D0]">
            Nenhuma publicação ainda.
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8D0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FAF7F4] border border-[#E2D8D0] rounded-full flex items-center justify-center text-xl shadow-inner">
                  {loja?.emoji || "🏪"}
                </div>
                <div>
                  <h4 className="font-bold text-[#2A1F14] leading-tight">{loja?.name || "Nome da Loja"}</h4>
                  <span className="text-xs font-semibold text-[#8C7361]">{formatarData(post.criado_em)}</span>
                </div>
              </div>

              <p className="text-[#4A3A2F] whitespace-pre-wrap">{post.conteudo}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};