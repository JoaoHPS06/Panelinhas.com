import { useState } from "react";
import { Carrossel } from "./Carrossel";
//import { CardLoja } from "./CardLoja";
import { PredioLoja } from "./PredioLoja";
import artePadaria from '../assets/padaria.png';
//import arteRestaurante from '../assets/restaurante.png';

const categorias = [
  "🏪 Todas",
  "🍽️ Alimentação",
  "👗 Moda",
  "💻 Eletrônicos",
  "💄 Beleza",
  "🏺 Artesanato",
  "🌱 Aberto agora",
];

export const Home = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("🏪 Todas");

  return (
    <div className="w-full mx-auto pb-4 space-y-5 select-none text-slate-800 pt-32">
      <Carrossel/>

      <div className="space-y-2 ml-4">
        <span className="text-[14px]  font-bold text-[#9E8878] uppercase tracking-widest block px-1">
          Tipo de loja
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaAtiva(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 shrink-0 cursor-pointer ${
                cat === categoriaAtiva
                  ? "bg-[#D85A30] text-white border-[#D85A30]"
                  : "bg-[#FAF7F4] text-[#6B5040] border-[#E2D8D0] hover:bg-[#F2EDE6] hover:border-[#C9A898]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <PredioLoja 
        imagem={artePadaria} 
        nome="Padaria do Zé" 
        posicao="" 
      />
    </div>
  );
};
