import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LojaHeader } from "../components/LojaHeader.tsx";
import { LojaProdutos, type Produto } from "../components/LojaProdutos.tsx";
import { LojaAvaliacoes } from "../components/LojaAvaliacoes.tsx";
import { LojaPosts } from "../components/LojaPosts.tsx";
import { LojaComunidade } from "../components/LojaComunidade.tsx";
import { type LojaData } from "../components/PredioLoja.tsx";
import { ModalContato } from "../components/ModalContato.tsx";

// Tipo estendido apenas com o que o endpoint de Lojas realmente devolve[cite: 4]
type LojaCompleta = LojaData & {
  telefone: string;  
  endereco: string;  
  produtos: Produto[];
  usuario_segue?: boolean;
};

export const Loja = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState<string>("catalogo");
  const [isModalAberto, setIsModalAberto] = useState<boolean>(false);
  
  const [lojaAtual, setLojaAtual] = useState<LojaCompleta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscarDadosDaLoja = async () => {
      try {
        setLoading(true);
        // GET para a API de lojas do Django[cite: 2, 5]
        const resposta = await fetch(`http://localhost:8000/api/lojas/${id}/`);
        
        if (!resposta.ok) {
          throw new Error("Estabelecimento não encontrado");
        }

        const dadosBackend = await resposta.json();

        // ADAPTER: Traduz o JSON do Django para o formato visual[cite: 4]
        const lojaAdaptada: LojaCompleta = {
          id: dadosBackend.id,
          name: dadosBackend.nome, // Django 'nome' -> React 'name'[cite: 4]
          category: dadosBackend.categoria, // Django 'categoria' -> React 'category'[cite: 4]
          
          produtos: dadosBackend.produtos.map((p: any) => ({
            id: String(p.id),
            nome: p.nome,
            descricao: p.descricao || "",
            preco: parseFloat(p.preco) || 0.0,
            image: "📦", 
            ehNovo: false,
          })),

          followers: dadosBackend.total_seguidores || 0,
          usuario_segue: dadosBackend.usuario_segue || false,

          // Fallbacks estéticos locais (enquanto não adiciona no Model do Django)
          emoji: "🏪",
          rating: 4.8,
          isOpen: true,
          windows: [true, true, true, false],              
          primary: "marrom-rustico", 
          secondary: "areia",
          telefone: "(31) 98888-7777",
          endereco: "Rua Direita, 150 - Centro, Ouro Preto - MG"
        };

        setLojaAtual(lojaAdaptada);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) buscarDadosDaLoja();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-creme-suave">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (erro || !lojaAtual) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-areia/20 p-4 text-center">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-2xl font-black text-marrom-rustico">Estabelecimento não encontrado</h1>
        <button onClick={() => navigate("/")} className="mt-4 bg-marrom-rustico text-white font-bold px-6 py-2 rounded-full text-sm">
          Voltar para a Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-white to-areia/10 pb-20">
      <LojaHeader 
        loja={lojaAtual} 
        aba={abaAtiva} 
        setAbaAtiva={setAbaAtiva}
        onContatoClick={() => setIsModalAberto(true)} 
        onVoltar={() => navigate(-1)}
      />

      <main className="container mx-auto">
        {/* Passamos o ID numérico da loja para que as abas saibam quem filtrar no Django */}
        {abaAtiva === "catalogo" && (
          <LojaProdutos produtos={lojaAtual.produtos} />
        )}
        
        {abaAtiva === "avaliacoes" && (
          <LojaAvaliacoes idLoja={lojaAtual.id} />
        )}
        
        {abaAtiva === "posts" && (
          <LojaPosts idLoja={lojaAtual.id} />
        )}

        {abaAtiva === "comunidade" && (
          <LojaComunidade idLoja={lojaAtual.id} />
        )}
      </main>

      <ModalContato isOpen={isModalAberto} onClose={() => setIsModalAberto(false)} loja={lojaAtual} />
    </div>
  );
};