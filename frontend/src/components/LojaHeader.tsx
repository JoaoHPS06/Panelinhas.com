import { BotaoPrincipal } from "./BotaoPrincipal.tsx";
import { type LojaData } from "./PredioLoja.tsx";

interface LojaHeaderProps {
  loja: LojaData; 
  aba: string;
  setAbaAtiva: (novaAba: string) => void;
  onContatoClick: () => void;
  onVoltar: () => void;
}

export const LojaHeader = ({ loja, aba, setAbaAtiva, onContatoClick, onVoltar } : LojaHeaderProps) => {
    return(
        <>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-150 bg-linear-to-br from-areia/50 to-amarelo-mostarda/10 rounded-b-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_30px_rgba(45,26,13,0.02)]">
            <div className="h-64 bg-linear-to-r from-areia/40 via-white/30 to-areia/30 relative flex items-center justify-center text-8xl overflow-hidden border-b border-white/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center, #FBBB01_0%, transparent_60%)] blur-3xl opacity-40"></div>
                <span className="relative z-10 drop-shadow-sm">{loja.emoji}</span>
                
                <div className="absolute top-6 left-0 right-0 max-w-6xl mx-auto px-4 md:px-8 pointer-events-none">
                    <button 
                        onClick={onVoltar}
                        className="pointer-events-auto flex items-center gap-2 bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/80 transition-all duration-300 rounded-full px-5 py-2.5 text-sm font-bold text-cafe-expresso shadow-sm hover:shadow-md cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        Voltar
                    </button>

                    <button 
                        onClick={onContatoClick}
                        className="pointer-events-auto flex items-center gap-2 bg-marrom-rustico hover:bg-marrom-rustico/90 text-white transition-all duration-300 rounded-full px-6 py-2.5 text-sm font-bold shadow-md cursor-pointer hover:-translate-y-0.5"
                    >
                        <span>📞</span> Contato
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 pb-0 relative">
                <div className="flex justify-between items-start pt-4">
                    <div className="w-28 h-28 bg-white/90 backdrop-blur-md rounded-2xl border-4 border-white shadow-[0_12px_32px_rgba(45,26,13,0.06)] flex items-center justify-center text-5xl -mt-16 relative z-10 transition-transform hover:scale-105 cursor-pointer">
                        {loja.emoji}
                    </div>
                    <BotaoPrincipal texto='+ Seguir'/>
                </div>

                <div className="mt-4 pb-6">
                    <h1 className="text-4xl font-extrabold text-marrom-rustico tracking-tight md:text-5xl">
                        {loja.name}
                    </h1>
                    <p className="text-cafe-expresso/70 font-semibold mt-1.5 text-base">
                        {loja.category} · Centro
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-4 items-center">
                        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-white shadow-sm">
                            <strong className="text-amarelo-mostarda text-xl leading-none">★</strong>
                            <span className="font-bold text-cafe-expresso">{loja.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-white shadow-sm">
                            <span className="font-bold text-cafe-expresso">{loja.followers}</span>
                            <span className="text-cafe-expresso/60 text-sm font-semibold">seguidores</span>
                        </div>
                        
                        {loja.isOpen ? (
                            <div className="bg-verde-salvia/10 backdrop-blur-sm text-verde-salvia font-bold uppercase text-xs tracking-wider px-4 py-2 rounded-xl border border-verde-salvia/20">
                                Aberto Agora
                            </div>
                        ) : (
                            <div className="bg-vermelho-pimenta/10 backdrop-blur-sm text-vermelho-pimenta font-bold uppercase text-xs tracking-wider px-4 py-2 rounded-xl border border-vermelho-pimenta/20">
                                Fechado
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-8 border-t border-cafe-expresso/10 overflow-x-auto scrollbar-none relative" id="tabsContainer">
                    <button 
                        onClick={() => setAbaAtiva('catalogo')} 
                        className={`tab-btn py-4 text-sm font-bold tracking-wide uppercase relative transition-colors duration-300 whitespace-nowrap cursor-pointer
                            ${aba === 'catalogo' ? 'text-marrom-rustico' : 'text-cafe-expresso/50 hover:text-cafe-expresso/80'}`}
                    >
                        Catálogo
                        <div className={`tab-indicator absolute bottom-0 left-0 right-0 h-0.75 bg-marrom-rustico rounded-full transition-all duration-300
                            ${aba === 'catalogo' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                        ></div>
                    </button>

                    <button 
                        onClick={() => setAbaAtiva('avaliacoes')} 
                        className={`tab-btn py-4 text-sm font-bold tracking-wide uppercase relative transition-colors duration-300 whitespace-nowrap cursor-pointer
                            ${aba === 'avaliacoes' ? 'text-marrom-rustico' : 'text-cafe-expresso/50 hover:text-cafe-expresso/80'}`}
                    >
                        Avaliações
                        <div className={`tab-indicator absolute bottom-0 left-0 right-0 h-0.75 bg-marrom-rustico rounded-full transition-all duration-300
                            ${aba === 'avaliacoes' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                        ></div>
                    </button>

                    <button 
                        onClick={() => setAbaAtiva('posts')} 
                        className={`tab-btn py-4 text-sm font-bold tracking-wide uppercase relative transition-colors duration-300 whitespace-nowrap cursor-pointer
                            ${aba === 'posts' ? 'text-marrom-rustico' : 'text-cafe-expresso/50 hover:text-cafe-expresso/80'}`}
                    >
                        Postagens
                        <div className={`tab-indicator absolute bottom-0 left-0 right-0 h-0.75 bg-marrom-rustico rounded-full transition-all duration-300
                            ${aba === 'posts' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                        ></div>
                    </button>

                    <button 
                        onClick={() => setAbaAtiva('comunidade')} 
                        className={`tab-btn py-4 text-sm font-bold tracking-wide uppercase relative transition-colors duration-300 whitespace-nowrap cursor-pointer
                            ${aba === 'comunidade' ? 'text-marrom-rustico' : 'text-cafe-expresso/50 hover:text-cafe-expresso/80'}`}
                    >
                        Comunidade
                        <div className={`tab-indicator absolute bottom-0 left-0 right-0 h-0.75 bg-marrom-rustico rounded-full transition-all duration-300
                            ${aba === 'comunidade' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                        ></div>
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};