import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LojaHeader } from "../components/LojaHeader.tsx";
import { LojaProdutos, type Produto } from "../components/LojaProdutos.tsx";
import { LojaAvaliacoes } from "../components/LojaAvaliacoes.tsx";
import { LojaPosts } from "../components/LojaPosts.tsx";
import { LojaComunidade } from "../components/LojaComunidade.tsx";
import { type LojaData } from "../components/PredioLoja.tsx";
import { ModalContato } from "../components/ModalContato.tsx";
import EmojiPicker from "emoji-picker-react";

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
  const [isModalProdutoAberto, setIsModalProdutoAberto] = useState<boolean>(false);
  
  const [lojaAtual, setLojaAtual] = useState<LojaCompleta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "", preco: "", emoji: "📦" });
  const [loadingProduto, setLoadingProduto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null); // NULO = criando; preenchido = editando

  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  // 1. Pega os dados salvos no navegador
  const userString = localStorage.getItem("Panelinha_user");
  const usuarioLogado = userString ? JSON.parse(userString) : null;
  
  // 2. MÁGICA DO JWT
  let loggedInUserId = null;
  if (usuarioLogado?.access) {
    try {
      const payloadBase64 = usuarioLogado.access.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      // Tenta pegar como 'user_id' (padrão do SimpleJWT) ou 'id'
      loggedInUserId = decodedPayload.user_id || decodedPayload.id; 
    } catch (e) {
      console.error("Erro ao decodificar o token:", e);
    }
  }

  // 3. COMPARAÇÃO BLINDADA: Transforma os dois em Texto para garantir que 13 === "13"
  const isOwner = lojaAtual?.dono != null && loggedInUserId != null && String(lojaAtual?.dono) === String(loggedInUserId);

  const buscarDadosDaLoja = async () => {
    try {
      setLoading(true);
      const headers: any = {};
      if (usuarioLogado?.access) {
        headers["Authorization"] = `Bearer ${usuarioLogado.access}`;
      }

      const resposta = await fetch(`http://localhost:8000/api/lojas/${id}/`, { headers });
      
      if (!resposta.ok) throw new Error("Estabelecimento não encontrado");

      const dadosBackend = await resposta.json();
      
      const verificarSeEhNovo = (dataCriacao: string) => {
        if (!dataCriacao) return true; // Se o backend não mandar data, deixamos como novo por segurança
        
        const dataDoProduto = new Date(dataCriacao);
        const dataSeteDiasAtras = new Date();
        dataSeteDiasAtras.setDate(dataSeteDiasAtras.getDate() - 7); // Volta 7 dias no tempo
        
        return dataDoProduto >= dataSeteDiasAtras;
      };

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
          ehNovo: verificarSeEhNovo(p.criado_em), 
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

  // Abre o modal já preenchido para EDITAR um produto existente
  const abrirEdicaoProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNovoProduto({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toFixed(2).replace(".", ","),
      emoji: produto.image
    });
    setIsModalProdutoAberto(true);
  };

  // Abre o modal limpo para CRIAR um produto novo
  const abrirNovoProduto = () => {
    setProdutoEditando(null);
    setNovoProduto({ nome: "", descricao: "", preco: "", emoji: "📦" });
    setIsModalProdutoAberto(true);
  };

  const fecharModalProduto = () => {
    setIsModalProdutoAberto(false);
    setProdutoEditando(null);
  };

  const handleSalvarProduto = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!usuarioLogado?.access) return;

    setLoadingProduto(true);
    try {
      const url = produtoEditando
        ? `http://localhost:8000/api/produtos/${produtoEditando.id}/`
        : "http://localhost:8000/api/produtos/";
      const method = produtoEditando ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioLogado.access}`
        },
        body: JSON.stringify({
          loja: id, 
          nome: novoProduto.nome,
          descricao: novoProduto.descricao,
          preco: parseFloat(novoProduto.preco.replace(",", ".")), 
          emoji: novoProduto.emoji
        })
      });

      if (res.ok) {
        fecharModalProduto();
        setNovoProduto({ nome: "", descricao: "", preco: "", emoji: "📦" });
        buscarDadosDaLoja(); 
      } else {
        const errorData = await res.json();
        console.error("Erro do backend:", errorData);
        alert("Erro ao salvar o produto. Verifique o console.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoadingProduto(false);
    }
  };

  // Função para Abrir/Fechar a loja
  const handleToggleStatus = async () => {
    if (!lojaAtual || !usuarioLogado?.access) return;

    // Inverte o status atual (Se tá aberta, fecha. Se tá fechada, abre)
    const novoStatus = !lojaAtual.isOpen;
    
    // Atualiza a interface na mesma hora para o usuário não ficar esperando
    setLojaAtual({ ...lojaAtual, isOpen: novoStatus });

    try {
      const res = await fetch(`http://localhost:8000/api/lojas/${id}/`, {
        method: "PATCH", // PATCH atualiza apenas o campo que enviarmos
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioLogado.access}`
        },
        body: JSON.stringify({ esta_aberta: novoStatus })
      });

      if (!res.ok) {
        // Se der erro no banco, desfazemos a mudança visual
        setLojaAtual({ ...lojaAtual, isOpen: !novoStatus });
        alert("Erro ao alterar o status da loja.");
      }
    } catch (error) {
      console.error(error);
      setLojaAtual({ ...lojaAtual, isOpen: !novoStatus });
      alert("Erro de conexão com o servidor.");
    }
  };

  const handleDeletarProduto = async (idProduto: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const userString = localStorage.getItem("Panelinha_user");
    const token = userString ? JSON.parse(userString).access : null;

    try {
      const res = await fetch(`http://localhost:8000/api/produtos/${idProduto}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Atualiza o estado da loja na hora para remover o card da tela
        setLojaAtual(prev => prev ? ({
          ...prev, 
          produtos: prev.produtos.filter(p => p.id !== idProduto)
        }) : prev);
      }
    } catch (err) {
      alert("Erro ao remover produto.");
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
        isOwner={isOwner}
        onToggleStatus={handleToggleStatus}
      />

      <main className="container mx-auto">
        {abaAtiva === "catalogo" && (
          <LojaProdutos 
            produtos={lojaAtual.produtos} 
            isOwner={isOwner} 
            onAddClick={abrirNovoProduto} 
            onDeleteClick={handleDeletarProduto}
            onEditClick={abrirEdicaoProduto}
          />
        )}
        
        {abaAtiva === "avaliacoes" && <LojaAvaliacoes idLoja={lojaAtual.id} isOwner={isOwner} />}
        {abaAtiva === "posts" && <LojaPosts idLoja={lojaAtual.id} isOwner={isOwner} loja={lojaAtual} />}
        {abaAtiva === "comunidade" && <LojaComunidade idLoja={lojaAtual.id} isOwner={isOwner} />}
      </main>

      <ModalContato isOpen={isModalAberto} onClose={() => setIsModalAberto(false)} loja={lojaAtual} />

      {isModalProdutoAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={fecharModalProduto} className="absolute top-4 right-4 text-marrom-rustico/50 hover:text-marrom-rustico text-xl cursor-pointer">
              ✕
            </button>
            <h3 className="text-2xl font-black text-marrom-rustico mb-2">{produtoEditando ? "Editar Produto" : "Novo Produto"}</h3>
            <p className="text-sm text-cafe-expresso/60 mb-6">{produtoEditando ? "Atualize as informações deste produto." : "Adicione um novo item ao catálogo da sua loja."}</p>

            <form onSubmit={handleSalvarProduto} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 w-1/4 relative">
                  <label className="text-xs font-bold uppercase text-marrom-rustico/70">Ícone</label>
                  
                  {/* Botão que mostra o emoji atual e abre o seletor ao clicar */}
                  <button 
                    type="button" 
                    onClick={() => setMostrarEmojis(!mostrarEmojis)}
                    className="w-full h-10.5 bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl text-2xl flex items-center justify-center hover:bg-white hover:border-[#D85A30] transition-colors cursor-pointer"
                  >
                    {novoProduto.emoji}
                  </button>

                  {/* A Janela flutuante de Emojis */}
                  {mostrarEmojis && (
                    <div className="absolute top-16 left-0 z-50 shadow-2xl rounded-lg">
                      <EmojiPicker 
                        onEmojiClick={(emojiObject) => {
                          setNovoProduto({...novoProduto, emoji: emojiObject.emoji});
                          setMostrarEmojis(false); // Fecha a janela após escolher
                        }} 
                        autoFocusSearch={false}
                        searchDisabled={false}
                        skinTonesDisabled={true}
                        width={300}
                        height={400}
                      />
                    </div>
                  )}
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
                {loadingProduto ? "Salvando..." : (produtoEditando ? "Salvar Alterações" : "Salvar no Catálogo")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};