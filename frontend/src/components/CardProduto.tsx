interface CardProdutoProps {
  image: string; // O emoji do produto
  nome: string;
  descricao: string;
  preco: number;
  ehNovo?: boolean; // Determina se a tag verde vai aparecer
  isOwner?: boolean;     // NOVO: mostra os botões de editar/excluir só para o dono
  onDelete?: () => void; // NOVO: ação disparada ao clicar em excluir
  onEdit?: () => void;   // NOVO: ação disparada ao clicar em editar
}

export const CardProduto = ({ image, nome, descricao, preco, ehNovo, isOwner, onDelete, onEdit }: CardProdutoProps) => {
  return (
    <div 
      onMouseMove={(e) => typeof window !== 'undefined' && (window as any).tilt?.(e.nativeEvent, e.currentTarget)} 
      onMouseLeave={(e) => typeof window !== 'undefined' && (window as any).resetTilt?.(e.currentTarget)}
      className="tilt-card bg-white rounded-2xl overflow-visible shadow-[0_8px_24px_rgba(45,26,13,0.04)] border border-creme-suave relative cursor-pointer group"
    >
      
      {/* TAG DE NOVO (Canto Superior Esquerdo) */}
      {ehNovo && (
        <div className="absolute -top-2 -left-2 bg-verde-salvia text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md z-20 animate-bounce">
          Novo
        </div>
      )}

      {/* BOTÕES DE EDITAR/EXCLUIR (Canto Superior Direito) — só para o dono */}
      {isOwner && (
        <div className="absolute -top-2 -right-2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            title="Editar produto"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-marrom-rustico border border-marrom-rustico/20 shadow-md hover:bg-marrom-rustico hover:text-white cursor-pointer"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Excluir produto"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-vermelho-pimenta border border-vermelho-pimenta/20 shadow-md hover:bg-vermelho-pimenta hover:text-white cursor-pointer"
          >
            🗑️
          </button>
        </div>
      )}

      <div className="tilt-content flex flex-col h-full">
        {/* Container da Imagem/Emoji */}
        <div className="p-3 pb-0">
          <div className="h-36 bg-linear-to-br from-areia to-amarelo-mostarda/40 rounded-xl flex items-center justify-center text-6xl relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
            {image}
          </div>
        </div>

        {/* Textos e Informações */}
        <div className="p-5 flex flex-col flex-1 text-center justify-center">
          <h3 className="text-base font-extrabold text-marrom-rustico mb-1.5 leading-tight">
            {nome}
          </h3>
          
          <p className="text-cafe-expresso/60 text-sm leading-snug mb-3 flex-1">
            {descricao}
          </p>
          
          {/* Preço formatado como R$ 00,00 */}
          <div className="text-xl font-black text-vermelho-pimenta">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco)}
          </div>
        </div>
      </div>
    </div>
  );
};