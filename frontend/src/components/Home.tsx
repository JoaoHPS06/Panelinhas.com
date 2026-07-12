import { useState, useEffect } from "react";
import { Carrossel } from "./Carrossel";
import { Faixada } from "./Faixada";

export const Home = () => {
  const [lojas, setLojas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados reais da sua API
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
    <div className="w-full mx-auto pb-4 space-y-5 select-none text-slate-800 pt-32">
      <Carrossel />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
          <span className="text-6xl animate-bounce mb-4">🏗️</span>
          <h3 className="text-xl font-bold text-[#8C7361]">Construindo a rua...</h3>
        </div>
      ) : lojas.length === 0 ? (
        <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-[#E2D8D0] border-dashed mx-4 max-w-3xl md:mx-auto">
          <span className="text-6xl block mb-4 opacity-50">🚧</span>
          <h3 className="text-2xl font-bold text-[#2A1F14]">A rua está vazia</h3>
          <p className="text-[#8C7361] mt-2">Seja o primeiro a inaugurar um estabelecimento por aqui!</p>
        </div>
      ) : (
        // A Faixada cuida dos filtros e da renderização sozinha!
        <Faixada listaDeLojas={lojas} />
      )}
      
    </div>
  );
};