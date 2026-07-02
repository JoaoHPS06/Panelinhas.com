import { type LojaData } from "./PredioLoja.tsx";

interface ModalContatoProps {
  isOpen: boolean;
  onClose: () => void;
  loja: LojaData & { telefone: string; endereco: string };
}

export const ModalContato = ({ isOpen, onClose, loja }: ModalContatoProps) => {
  // Se a flag for falsa, o componente retorna nulo (não renderiza nada na árvore)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/* Backdrop: O fundo escurecido que fecha o modal se for clicado */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Janela do Card Centralizado */}
      <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-3xl p-6 shadow-[0_24px_48px_rgba(45,26,13,0.16)] border border-white relative z-10 scale-up">
        
        {/* Botão Fechar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cafe-expresso/5 hover:bg-cafe-expresso/10 flex items-center justify-center text-cafe-expresso/60 transition-colors cursor-pointer font-bold text-sm"
        >
          ✕
        </button>

        {/* Cabeçalho do Modal */}
        <div className="text-center mb-6">
          <span className="text-4xl inline-block mb-2 animate-bounce">{loja.emoji}</span>
          <h3 className="text-xl font-black text-marrom-rustico tracking-tight">
            Entre em contato com a {loja.name}
          </h3>
          <p className="text-cafe-expresso/60 text-xs font-semibold mt-1">
            Escolha a melhor forma de fazer o seu pedido
          </p>
        </div>

        {/* Opções de Contato de Ação Rápida */}
        <div className="space-y-3">
          
          {/* Botão WhatsApp */}
          <a 
            href={`https://wa.me/${loja.telefone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between bg-verde-salvia hover:bg-verde-salvia/90 text-white font-bold p-4 rounded-2xl transition-all shadow-md shadow-verde-salvia/20 hover:-translate-y-0.5 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">💬</span>
              <span>Chamar no WhatsApp</span>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">Rápido</span>
          </a>

          {/* Botão Telefone */}
          <a 
            href={`tel:${loja.telefone}`}
            className="flex items-center justify-between bg-white hover:bg-areia/10 text-cafe-expresso border border-creme-suave font-bold p-4 rounded-2xl transition-all hover:-translate-y-0.5 text-sm shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">📞</span>
              <span>Ligar via Telefone</span>
            </div>
            <span className="text-cafe-expresso/60 text-xs font-semibold">{loja.telefone}</span>
          </a>

          {/* Card de Endereço Físico */}
          <div className="bg-areia/10 border border-areia/30 p-4 rounded-2xl text-center mt-4">
            <span className="text-lg inline-block mb-1">📍</span>
            <h4 className="font-extrabold text-marrom-rustico text-xs uppercase tracking-wider mb-1">Endereço da Loja</h4>
            <p className="text-cafe-expresso/80 text-xs leading-relaxed font-medium">
              {loja.endereco}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};