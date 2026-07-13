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

  // Estados para edição de um post existente
  const [postEditandoId, setPostEditandoId] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [loadingEdicao, setLoadingEdicao] = useState(false);

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

  // Abre o modo de edição preenchendo o texto atual do post
  const iniciarEdicao = (post: Post) => {
    setPostEditandoId(post.id);
    setTextoEdicao(post.conteudo);
  };

  const cancelarEdicao = () => {
    setPostEditandoId(null);
    setTextoEdicao("");
  };

  const handleSalvarEdicao = async (idPost: number) => {
    if (!textoEdicao.trim()) return;

    const userString = localStorage.getItem("Panelinha_user");
    const token = userString ? JSON.parse(userString).access : null;

    setLoadingEdicao(true);
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${idPost}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ conteudo: textoEdicao })
      });

      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === idPost ? { ...p, conteudo: textoEdicao } : p));
        cancelarEdicao();
      } else {
        alert("Erro ao salvar a edição do post.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoadingEdicao(false);
    }
  };

  const handleDeletarPost = async (idPost: number) => {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;

    const userString = localStorage.getItem("Panelinha_user");
    const token = userString ? JSON.parse(userString).access : null;

    try {
      const res = await fetch(`http://localhost:8000/api/posts/${idPost}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== idPost));
        if (postEditandoId === idPost) cancelarEdicao();
      } else {
        alert("Erro ao excluir a publicação.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
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
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FAF7F4] border border-[#E2D8D0] rounded-full flex items-center justify-center text-xl shadow-inner">
                    {loja?.emoji || "🏪"}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2A1F14] leading-tight">{loja?.name || "Nome da Loja"}</h4>
                    <span className="text-xs font-semibold text-[#8C7361]">{formatarData(post.criado_em)}</span>
                  </div>
                </div>

                {/* AÇÕES DO DONO — só aparecem fora do modo de edição */}
                {isOwner && postEditandoId !== post.id && (
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => iniciarEdicao(post)}
                      className="text-xs font-bold text-[#8C7361] hover:text-[#D85A30] uppercase cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletarPost(post.id)}
                      className="text-xs font-bold text-red-400 hover:text-red-600 uppercase cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>

              {postEditandoId === post.id ? (
                // MODO DE EDIÇÃO
                <div>
                  <textarea
                    value={textoEdicao}
                    onChange={(e) => setTextoEdicao(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 outline-none focus:border-[#D85A30] resize-none min-h-20 text-[#2A1F14]"
                    autoFocus
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={cancelarEdicao}
                      disabled={loadingEdicao}
                      className="text-sm font-bold text-[#8C7361] hover:text-[#2A1F14] px-4 py-2 cursor-pointer disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSalvarEdicao(post.id)}
                      disabled={loadingEdicao || !textoEdicao.trim()}
                      className="bg-[#D85A30] text-white font-bold px-6 py-2 rounded-full hover:bg-[#C24B24] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {loadingEdicao ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#4A3A2F] whitespace-pre-wrap">{post.conteudo}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};