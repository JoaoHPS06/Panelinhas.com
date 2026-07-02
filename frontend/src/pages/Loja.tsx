import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LojaHeader } from "../components/LojaHeader.tsx";
import { LojaProdutos, type Produto } from "../components/LojaProdutos.tsx";
import { LojaAvaliacoes, type Avaliacao } from "../components/LojaAvaliacoes.tsx";
import { LojaPosts, type PostLoja } from "../components/LojaPosts.tsx";
import { LojaComunidade, type TopicoForum } from "../components/LojaComunidade.tsx";
import { type LojaData } from "../components/PredioLoja.tsx";
import { ModalContato } from "../components/ModalContato.tsx";

// Tipo estendido para agrupar a loja com seus dados internos das abas
type LojaCompleta = LojaData & {
  telefone: string;  // Campo adicionado para o modal
  endereco: string;  // Campo adicionado para o modal
  produtos: Produto[];
  avaliacoes: Avaliacao[];
  posts: PostLoja[];
  topicos: TopicoForum[];
};

// Nosso "Banco de Dados" simulado com DUAS lojas para testarmos a dinâmica
const todasAsLojas: LojaCompleta[] = [
  {
    id: 1, // Acessível via /loja/1
    name: "Pizzaria do Zé",
    emoji: "🍕",
    rating: 4.8,
    followers: 127,
    category: "Alimentação · Italiana",
    isOpen: true,
    windows: [true, true, true, false],              
    primary: "marrom-rustico", 
    secondary: "areia",  
    telefone: "(31) 98888-7777",
    endereco: "Rua Direita, 150 - Centro, Ouro Preto - MG",     
    produtos: [
      { id: "prod-1", image: "🍕", nome: "Pizza Margherita", descricao: "Molho fresco, mozzarella e manjericão.", preco: 42.9, ehNovo: true },
      { id: "prod-2", image: "🍕", nome: "Pizza 4 Queijos", descricao: "Mozzarella, provolone, gorgonzola e catupiry.", preco: 49.9 },
      { id: "prod-3", image: "🥤", nome: "Refrigerante Cola 2L", descricao: "Garrafa de 2 litros trincando de gelada.", preco: 11.0 },
      { id: "prod-4", image: "🍫", nome: "Broto de Nutella", descricao: "Pizza brotinho coberta com Nutella e morangos.", preco: 25.5, ehNovo: true }
    ],
    avaliacoes: [
      { id: "av-1", autor: "Carlos Silva", avatar: "👨🏽", nota: 5, data: "Há 2 dias", comentario: "A melhor pizza da região! Massa no ponto certo." },
      { id: "av-2", autor: "Ana Clara", avatar: "👩🏻", nota: 4, data: "Há 1 semana", comentario: "Muito boa, mas o refrigerante podia estar mais gelado." }
    ],
    posts: [
      { id: "p1", conteudoVisual: "👩‍🍳", texto: "Nossa nova pizzaiola em ação!", data: "Hoje", curtidas: 34 },
      { id: "p2", conteudoVisual: "🍕", texto: "Adoro a Pizza de Vocês!", data: "Hoje", curtidas: 120 }
    ],
    topicos: [
      {
        id: "t1", autor: "Lucas M.", avatar: "👨🏻‍💻", titulo: "A pizzaria tem opção sem glúten?", texto: "Alguém sabe me dizer se o cardápio oferece opções seguras para celíacos?", data: "Há 3 horas",
        respostas: [
          { id: "r1", autor: "Pizzaria do Zé", avatar: "🍕", texto: "Olá, Lucas! No momento nossas massas tradicionais contêm glúten, mas estamos desenvolvendo uma massa especial que lançaremos no mês que vem!", data: "Há 1 hora" }
        ]
      }
    ]
  },
  {
    id: 2, // Acessível via /loja/2
    name: "Burger do Chef",
    emoji: "🍔",
    rating: 4.9,
    followers: 342,
    category: "Alimentação · Lanches",
    isOpen: false, // Esta vai aparecer como FECHADA!
    windows: [true, false, true, false],              
    primary: "vermelho-pimenta", 
    secondary: "amarelo-mostarda",
    telefone: "(31) 98888-7777",
    endereco: "Rua Direita, 150 - Centro, Ouro Preto - MG",       
    produtos: [
      { id: "b-1", image: "🍔", nome: "Monster Burger", descricao: "Dois blends de 150g, muito queijo cheddar e bacon artesanal.", preco: 38.0, ehNovo: true },
      { id: "b-2", image: "🍟", nome: "Batata Frita Rústica", descricao: "Porção de batatas fritas temperadas com páprica e alecrim.", preco: 16.0 }
    ],
    avaliacoes: [
      { id: "av-3", autor: "Pedro Souza", avatar: "👨🏻", nota: 5, data: "Há 1 hora", comentario: "O ponto da carne veio perfeito! Hamburgueria sensacional." }
    ],
    posts: [
      { id: "p3", conteudoVisual: "🔥", texto: "Chapa quente por aqui! Preparando os blends do dia.", data: "Ontem", curtidas: 89 }
    ],
    topicos: [
      {
        id: "t1", autor: "Lucas M.", avatar: "👨🏻‍💻", titulo: "A pizzaria tem opção sem glúten?", texto: "Alguém sabe me dizer se o cardápio oferece opções seguras para celíacos?", data: "Há 3 horas",
        respostas: [
          { id: "r1", autor: "Pizzaria do Zé", avatar: "🍕", texto: "Olá, Lucas! No momento nossas massas tradicionais contêm glúten, mas estamos desenvolvendo uma massa especial que lançaremos no mês que vem!", data: "Há 1 hora" }
        ]
      }
    ]
  }
];

export const Loja = () => {
  // 1. Captura o ID vindo da URL (ex: /loja/1 ou /loja/2)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState<string>("catalogo");

  // O estado booleano (A nossa "flag de interrupção")
  const [isModalAberto, setIsModalAberto] = useState<boolean>(false);

  // 2. Faz a busca linear (.find) convertendo o ID da URL para número
  const lojaAtual = todasAsLojas.find((l) => l.id === Number(id));

  // 3. Tratamento de erro caso o usuário digite um ID que não existe (ex: /loja/999)
  if (!lojaAtual) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-areia/20 p-4 text-center">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-2xl font-black text-marrom-rustico">Estabelecimento não encontrado</h1>
        <p className="text-cafe-expresso/60 text-sm mt-1">O link que você acessou pode estar quebrado ou a loja não existe.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-white to-areia/10 pb-20">
      {/* Passando a loja encontrada dinamicamente */}
      <LojaHeader 
        loja={lojaAtual} 
        aba={abaAtiva} 
        setAbaAtiva={setAbaAtiva}
        onContatoClick={() => setIsModalAberto(true)} 
        onVoltar={() => navigate(-1)}
      />

      <main className="container mx-auto">
        {abaAtiva === "catalogo" && (
          <LojaProdutos produtos={lojaAtual.produtos} />
        )}
        
        {abaAtiva === "avaliacoes" && (
          <LojaAvaliacoes avaliacoes={lojaAtual.avaliacoes} />
        )}
        
        {abaAtiva === "posts" && (
          <LojaPosts posts={lojaAtual.posts} />
        )}

        {abaAtiva === "comunidade" && (
          <LojaComunidade topicos={lojaAtual.topicos} />
        )}
      </main>

      <ModalContato 
        isOpen={isModalAberto} 
        onClose={() => setIsModalAberto(false)} 
        loja={lojaAtual}
      />

    </div>
  );
};