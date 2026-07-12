import { useState } from "react";
import { Carrossel } from "./Carrossel";
//import { CardLoja } from "./CardLoja";
import { NewPredioLoja, type LojaData } from "./PredioLoja";
import { Faixada } from "./Faixada";

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

const lojas: LojaData[] = [
  {
    id: 1,
    name: "Pizzaria do Zé",
    category: "🍽️ Alimentação",
    emoji: "🍕",
    rating: 4.8,
    followers: 127,
    isOpen: true,
    windows: [true, false, true],
    primary: "#E2703A",
    secondary: "#FFD9A8",
  },
  {
    id: 2,
    name: "Moda Feminina Ana",
    category: "👗 Moda",
    emoji: "👗",
    rating: 4.6,
    followers: 89,
    isOpen: true,
    windows: [false, true, false],
    primary: "#9B59D0",
    secondary: "#EDD8F8",
  },
  {
    id: 3,
    name: "TechShop Eletrônicos",
    category: "💻 Eletrônicos",
    emoji: "💻",
    rating: 4.7,
    followers: 234,
    isOpen: true,
    tall: true,
    windows: [true, true, false],
    primary: "#3F7FD1",
    secondary: "#C8DDF8",
  },
  {
    id: 4,
    name: "Beleza Natural",
    category: "💄 Beleza",
    emoji: "💄",
    rating: 4.9,
    followers: 312,
    isOpen: false,
    windows: [false, true, false],
    primary: "#D9568C",
    secondary: "#FFD8E8",
  },
  {
    id: 5,
    name: "Artesanato Mineiro",
    category: "🏺 Artesanato",
    emoji: "🏺",
    rating: 4.5,
    followers: 56,
    isOpen: true,
    windows: [false, true, false],
    primary: "#4F9C42",
    secondary: "#D4EEC8",
  },
  {
    id: 6,
    name: "Padaria Estrela",
    category: "🍽️ Alimentação",
    emoji: "🥐",
    rating: 4.8,
    followers: 178,
    isOpen: true,
    windows: [true, false, true],
    primary: "#C99020",
    secondary: "#FFF2C4",
  },
  {
    id: 7,
    name: "Pet Amor",
    category: "🐾 Pet",
    emoji: "🐾",
    rating: 4.4,
    followers: 41,
    isOpen: true,
    windows: [false, true, false],
    primary: "#5878C0",
    secondary: "#D8E8F8",
  },
  {
    id: 8,
    name: "Livraria Cultura",
    category: "📚 Livros",
    emoji: "📚",
    rating: 4.7,
    followers: 93,
    isOpen: false,
    windows: [true, false, true],
    primary: "#A06820",
    secondary: "#F0DEBA",
  },
];

export const Home = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("🏪 Todas");
  const lojasFiltradas = lojas.filter((loja) => {
    if (categoriaAtiva === "🏪 Todas") return true;
    if (categoriaAtiva === "🌱 Aberto agora") return loja.isOpen;
    return loja.category === categoriaAtiva;
  });

  return (
    <div className="w-full mx-auto pb-4 space-y-5 select-none text-slate-800 pt-32">
      <Carrossel />

      <Faixada listaDeLojas={lojasFiltradas} />
      <NewPredioLoja loja={lojas[0]}/>
    </div>
  );
};
