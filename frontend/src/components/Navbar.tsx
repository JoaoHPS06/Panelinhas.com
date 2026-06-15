import { Link, useLocation } from "react-router-dom";

// 1. IMPORTANDO A IMAGEM: 
import logoPanelinhas from "../assets/logo_laranja.svg"; 

// 2. A "STRUCT" DO TYPESCRIPT:
interface ItemDoMenu {
  nome: string;
  caminho: string;
}

export const Navbar = () => {
  // 3. LIGANDO O RADAR:
  const local = useLocation();

  // 4. NOSSA LISTA DE DADOS (Só para o lado esquerdo):
  const links: ItemDoMenu[] = [
    { nome: "Home", caminho: "/" },
    { nome: "Explore", caminho: "/explore" },
    { nome: "Meu Feed", caminho: "/feed" }
  ];

  return (
    <nav className="sticky top-0 z-50 h-29 bg-white border-b border-black/10 px-7 flex items-center justify-between shadow-sm">
      
      {/* Esquerda: Links */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        
        {/* 5. O LAÇO DE REPETIÇÃO (Substituindo os 3 Links manuais) */}
        {links.map((link, index) => {
          // Criando uma variável para saber se a página atual é a do link
          const ativo = local.pathname === link.caminho;

          return (
            <Link
              key={index}
              to={link.caminho}
              // 6. AS CRASES MÁGICAS + OPERADOR TERNÁRIO:
              className={`px-4 py-1.5 rounded-full no-underline text-xs font-extrabold uppercase tracking-wider transition-all ${
                ativo
                  ? "bg-[#FAECE7] text-[#D85A30]" // Cor se estiver na página
                  : "text-[#6B5040] hover:bg-[#FAECE7] hover:text-[#D85A30]" // Cor normal
              }`}
            >
              {link.nome}
            </Link>
          );
        })}
      </div>

      {/* Centro: Logo (A Imagem que você enviou) */}
      <div className="flex items-center justify-center cursor-pointer hover:scale-105 hover:transition-transform">
        <Link to="/">
           {/* A TAG DE IMAGEM DO REACT */}
          <img 
            src={logoPanelinhas} 
            alt="Logo Panelinhas.com" 
            className="h-27 w-auto object-contain" // Ajusta a altura para caber perfeitamente no menu de h-16
          />
        </Link>
      </div>

      {/* Direita: Busca e Login (Mantido exatamente como você fez) */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-[#F2EDE6] border border-black/10 rounded-full px-4 py-1.5 w-64 focus-within:border-[#D85A30] transition-all">

          <input
            type="text"
            placeholder="Buscar lojas..."
            className="bg-transparent text-sm outline-none w-full text-[#2A1F14] placeholder-[#9E8878]"
          />
        </div>
        
        <Link
          to="/login"
          className="px-5 py-1.5 rounded-full no-underline border-1.5 border-[#D85A30] text-[#D85A30] text-sm font-extrabold hover:bg-[#D85A30] hover:text-white transition-all"
        >
          Login
        </Link>
      </div>      
    </nav>
  );
};