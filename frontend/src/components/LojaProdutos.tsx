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
}

export const LojaProdutos = ({ produtos }: LojaProdutosProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Título da Seção */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-marrom-rustico tracking-tight md:text-3xl">
          Cardápio Principal
        </h2>
        <p className="text-cafe-expresso/60 text-sm font-semibold mt-1">
          Selecione os seus itens favoritos
        </p>
      </div>

      {/* Grid Responsivo de Lojas/Produtos */}
      {produtos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
          <p className="text-cafe-expresso/50 font-medium">
            Nenhum produto encontrado neste catálogo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <CardProduto
              key={produto.id} // Chave única exigida pelo React para otimização de renderização
              image={produto.image}
              nome={produto.nome}
              descricao={produto.descricao}
              preco={produto.preco}
              ehNovo={produto.ehNovo}
            />
          ))}
        </div>
      )}
    </div>
  );
};