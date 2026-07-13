import { useState, useEffect } from "react";
import { Carrossel } from "./Carrossel";
import { Faixada } from "./Faixada";

export const Home = () => {
  const [lojas, setLojas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const buscarLojas = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/lojas/");
      if (res.ok) {
        const dadosBackend = await res.json();
        
        const lojasAdaptadas = dadosBackend.map((loja: any) => ({
          id: loja.id,
          name: loja.nome,
          category: loja.categoria || "Outros",
          emoji: loja.emoji || "🏪",
          rating: loja.nota_media || 5.0,
          followers: loja.total_seguidores || 0,
          isOpen: loja.esta_aberta ?? true,
          tall: loja.tall || false,
          windows: loja.janelas || [true, true, true, false],
          primary: loja.cor_primaria || "#D85A30",
          secondary: loja.cor_secundaria || "#FAF7F4",
        }));
        
        setLojas(lojasAdaptadas);
      }
    } catch (error) {
      console.error("Erro ao carregar a Rua Principal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarLojas();
  }, []);

  return (
    <div className="w-full mx-auto pb-4 space-y-6 select-none text-slate-800 pt-44">
      
      {/* PLACA DE BOAS VINDAS (Menor e Reta) */}
      <div className="flex justify-center px-4 relative z-10 mb-2">
        <div className="relative max-w-xl w-full">
            {/* Cordinhas pendurando */}
            <div className="absolute -top-6 left-12 w-1 h-8 bg-[#4A3A2F]/30 -rotate-6"></div>
            <div className="absolute -top-6 right-12 w-1 h-8 bg-[#4A3A2F]/30 rotate-6"></div>

            {/* Moldura de Madeira (Sem rotação) */}
            <div className="bg-[#6B5040] p-2 rounded-xl shadow-[0_8px_20px_rgba(42,31,20,0.15)]">
                {/* Lousa Negra */}
                <div className="bg-[#2A1F14] rounded-lg p-5 md:p-6 border-2 border-dashed border-[#8C7361]/40 text-center relative overflow-hidden">
                    {/* Efeito de giz apagado */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] blur-2xl pointer-events-none"></div>
                    
                    {/* Tachinhas */}
                    <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-[#1A120A]"></div>
                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#1A120A]"></div>
                    <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-[#1A120A]"></div>
                    <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#1A120A]"></div>

                    <h2 
                        className="text-2xl md:text-3xl font-black text-amarelo-mostarda mb-2 tracking-wide drop-shadow-sm" 
                        style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                        Bem Vindos ao Panelinhas.com
                    </h2>
                    <p className="text-[#F3E5D8] text-xs md:text-sm font-medium max-w-md mx-auto leading-relaxed opacity-90">
                        Descubra, siga e interaja com suas lojinhas favoritas.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <Carrossel />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
          <span className="text-6xl animate-bounce mb-4">🏗️</span>
          <h3 className="text-xl font-bold text-[#8C7361]">Construindo a rua...</h3>
        </div>
      ) : lojas.length === 0 ? (
        <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-[#E2D8D0] border-dashed mx-4 max-w-3xl md:mx-auto mt-8">
          <span className="text-6xl block mb-4 opacity-50">🚧</span>
          <h3 className="text-2xl font-bold text-[#2A1F14]">A rua está vazia</h3>
          <p className="text-[#8C7361] mt-2">Seja o primeiro a inaugurar um estabelecimento por aqui!</p>
        </div>
      ) : (
        <Faixada listaDeLojas={lojas} />
      )}
      
    </div>
  );
};