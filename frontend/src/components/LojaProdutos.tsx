import { CardProduto } from "./CardProduto.tsx";

// Definição da estrutura de um produto do catálogo
export interface Produto {
  id: string;
  image: string;
  nome: string;
  descricao: string;
  preco: number;
  ehNovo?: boolean;
}

interface LojaProdutosProps {
  produtos: Produto[];
  isOwner?: boolean;                       // NOVO: Flag para saber se o usuário logado é o dono
  onAddClick?: () => void;                 // NOVO: Ação disparada ao clicar em "Adicionar Produto"
  onDeleteClick?: (idProduto: string) => void; // NOVO: Ação disparada ao clicar em "Excluir Produto"
  onEditClick?: (produto: Produto) => void;    // NOVO: Ação disparada ao clicar em "Editar Produto"
}

export const LojaProdutos = ({ produtos, isOwner, onAddClick, onDeleteClick, onEditClick }: LojaProdutosProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      
      {/* Cabeçalho Inteligente: Mostra o botão se for o dono */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">
            Catálogo
          </h2>
          <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">
            Explore nossos itens e serviços
          </p>
        </div>

        {/* BOTÃO EXCLUSIVO PARA O DONO */}
        {isOwner && (
          <button
            onClick={onAddClick}
            className="bg-[#D85A30] hover:bg-[#BF4A22] text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-md text-sm shrink-0 cursor-pointer"
          >
            + Adicionar Produto
          </button>
        )}
      </div>

      {/* Grid Responsivo de Lojas/Produtos */}
      {produtos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl bg-white/50">
          <span className="text-4xl block mb-3 opacity-50">📦</span>
          <p className="text-cafe-expresso/50 font-medium">
            Nenhum produto cadastrado neste catálogo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <CardProduto
              key={produto.id} 
              image={produto.image}
              nome={produto.nome}
              descricao={produto.descricao}
              preco={produto.preco}
              ehNovo={produto.ehNovo}
              isOwner={isOwner}
              onDelete={() => onDeleteClick?.(produto.id)}
              onEdit={() => onEditClick?.(produto)}
            />
          ))}
        </div>
      )}
    </div>
  );
};