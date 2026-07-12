import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LojaHeader } from "../components/LojaHeader.tsx";
import { LojaProdutos, type Produto } from "../components/LojaProdutos.tsx";
import { LojaAvaliacoes } from "../components/LojaAvaliacoes.tsx";
import { LojaPosts } from "../components/LojaPosts.tsx";
import { LojaComunidade } from "../components/LojaComunidade.tsx";
import { type LojaData } from "../components/PredioLoja.tsx";
import { ModalContato } from "../components/ModalContato.tsx";

// Tipo estendido com o campo 'dono' para sabermos a quem a loja pertence[cite: 12]
type LojaCompleta = LojaData & {
  telefone: string;  
  endereco: string;  
  produtos: Produto[];
  usuario_segue?: boolean;
  dono: number; 
};

export const Loja = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState<string>("catalogo");
  const [isModalAberto, setIsModalAberto] = useState<boolean>(false);
  
  // NOVO: Controle do modal de adicionar produto[cite: 12]
  const [isModalProdutoAberto, setIsModalProdutoAberto] = useState<boolean>(false);
  
  const [lojaAtual, setLojaAtual] = useState<LojaCompleta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados do formulário do novo produto
  const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "", preco: "", image: "📦" });
  const [loadingProduto, setLoadingProduto] = useState(false);

  // Pega o ID do usuário logado para comparar com o dono da loja
  const userString = localStorage.getItem("Panelinha_user");
  const usuarioLogado = userString ? JSON.parse(userString) : null;
  const isOwner = lojaAtual?.dono === usuarioLogado?.id;

  const buscarDadosDaLoja = async () => {
    try {
      setLoading(true);
      // Incluindo o token caso o usuário esteja logado (para a API saber quem está acessando e devolver o usuario_segue)
      const headers: any = {};
      if (usuarioLogado?.access) {
        headers["Authorization"] = `Bearer ${usuarioLogado.access}`;
      }

      const resposta = await fetch(`http://localhost:8000/api/lojas/${id}/`, { headers });
      
      if (!resposta.ok) throw new Error("Estabelecimento não encontrado");

      const dadosBackend = await resposta.json();

      // ADAPTER: Traduz o JSON do Django para o formato visual[cite: 12]
      const lojaAdaptada: LojaCompleta = {
        id: dadosBackend.id,
        dono: dadosBackend.dono,
        name: dadosBackend.nome, 
        category: dadosBackend.categoria,
        
        produtos: dadosBackend.produtos.map((p: any) => ({
          id: String(p.id),
          nome: p.nome,
          descricao: p.descricao || "",
          preco: parseFloat(p.preco) || 0.0,
          image: p.emoji || "📦", 
          ehNovo: true, // Marcamos como novo para destacar
        })),

        followers: dadosBackend.total_seguidores || 0,
        usuario_segue: dadosBackend.usuario_segue || false,
        emoji: dadosBackend.emoji || "🏪",
        rating: dadosBackend.nota_media || 5.0,
        isOpen: dadosBackend.esta_aberta ?? true,
        windows: dadosBackend.janelas || [true, true, true, false],              
        primary: dadosBackend.cor_primaria || "#D85A30", 
        secondary: dadosBackend.cor_secundaria || "#FAF7F4",
        telefone: dadosBackend.telefone || "Telefone não cadastrado",
        endereco: dadosBackend.endereco || "Endereço não cadastrado"
      };

      setLojaAtual(lojaAdaptada);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) buscarDadosDaLoja();
  }, [id]);

  // Função para enviar o produto novo para o Django
  const handleAdicionarProduto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuarioLogado?.access) return;

    setLoadingProduto(true);
    try {
      const res = await fetch("http://localhost:8000/api/produtos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioLogado.access}`
        },
        body: JSON.stringify({
          loja: id, // O ID da loja atual
          nome: novoProduto.nome,
          descricao: novoProduto.descricao,
          preco: parseFloat(novoProduto.preco.replace(",", ".")), // Garante o formato numérico correto
          emoji: novoProduto.image
        })
      });

      if (res.ok) {
        setIsModalProdutoAberto(false);
        setNovoProduto({ nome: "", descricao: "", preco: "", image: "📦" });
        buscarDadosDaLoja(); // Recarrega a loja para mostrar o item novo!
      } else {
        alert("Erro ao salvar o produto.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoadingProduto(false);
    }
  };

  if (loading) return <div className="w-full min-h-screen flex items-center justify-center bg-creme-suave"><div className="animate-spin text-4xl">⏳</div></div>;
  if (erro || !lojaAtual) return <div className="w-full min-h-screen flex flex-col items-center justify-center bg-areia/20 p-4 text-center"><span className="text-6xl mb-4">🔍</span><h1 className="text-2xl font-black text-marrom-rustico">Estabelecimento não encontrado</h1><button onClick={() => navigate("/")} className="mt-4 bg-marrom-rustico text-white font-bold px-6 py-2 rounded-full text-sm">Voltar para a Home</button></div>;

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-white to-areia/10 pb-20 relative">
      <LojaHeader 
        loja={lojaAtual} 
        aba={abaAtiva} 
        setAbaAtiva={setAbaAtiva}
        onContatoClick={() => setIsModalAberto(true)} 
        onVoltar={() => navigate(-1)}
      />

      <main className="container mx-auto">
        {abaAtiva === "catalogo" && (
          <LojaProdutos 
            produtos={lojaAtual.produtos} 
            isOwner={isOwner} 
            onAddClick={() => setIsModalProdutoAberto(true)} 
          />
        )}
        
        {abaAtiva === "avaliacoes" && <LojaAvaliacoes idLoja={lojaAtual.id} />}
        {abaAtiva === "posts" && <LojaPosts idLoja={lojaAtual.id} />}
        {abaAtiva === "comunidade" && <LojaComunidade idLoja={lojaAtual.id} />}
      </main>

      <ModalContato isOpen={isModalAberto} onClose={() => setIsModalAberto(false)} loja={lojaAtual} />

      {/* MODAL DE ADICIONAR PRODUTO */}
      {isModalProdutoAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalProdutoAberto(false)} className="absolute top-4 right-4 text-marrom-rustico/50 hover:text-marrom-rustico text-xl cursor-pointer">
              ✕
            </button>
            <h3 className="text-2xl font-black text-marrom-rustico mb-2">Novo Produto</h3>
            <p className="text-sm text-cafe-expresso/60 mb-6">Adicione um novo item ao catálogo da sua loja.</p>

            <form onSubmit={handleAdicionarProduto} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 w-1/4">
                  <label className="text-xs font-bold uppercase text-marrom-rustico/70">Ícone</label>
                  <input required value={novoProduto.image} onChange={(e) => setNovoProduto({...novoProduto, image: e.target.value})} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-3 py-2 text-center text-xl outline-none focus:border-[#D85A30]" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-bold uppercase text-marrom-rustico/70">Nome do Produto</label>
                  <input required placeholder="Ex: Bolo de Cenoura" value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-[#D85A30]" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-marrom-rustico/70">Descrição</label>
                <textarea required rows={2} placeholder="Descreva os detalhes do produto..." value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-[#D85A30] resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-marrom-rustico/70">Preço (R$)</label>
                <input required type="text" placeholder="Ex: 25.90" value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-[#D85A30]" />
              </div>

              <button type="submit" disabled={loadingProduto} className="w-full mt-4 bg-[#D85A30] text-white font-bold py-3 rounded-xl hover:bg-[#BF4A22] transition-colors shadow-md disabled:bg-gray-400 cursor-pointer">
                {loadingProduto ? "Salvando..." : "Salvar no Catálogo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};