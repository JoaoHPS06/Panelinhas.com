import { Link, useLocation } from "react-router-dom";

// 1. IMPORTANDO A IMAGEM: 
import logoPanelinhas from "../assets/logo.png"; 

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
    <nav className="fixed top-14 left-1/2 -translate-x-1/2 w-[96%] max-w-6xl h-16 rounded-full flex items-center justify-between px-8 z-50 backdrop-blur-md bg-creme-suave/70 border border-marrom-rustico/10 shadow-lg">
      
      {/* Esquerda: Links */}
      <div className="flex gap-6 items-center font-nunito">
        
        {/* 5. O LAÇO DE REPETIÇÃO (Substituindo os 3 Links manuais) */}
        {links.map((link, index) => {
          // Criando uma variável para saber se a página atual é a do link
          const ativo = local.pathname === link.caminho;

          return (
            <Link
              key={index}
              to={link.caminho}
              className={`px-4 py-1.5 rounded-full no-underline hover:underline hover:underline-offset-8 text-xs font-extrabold uppercase tracking-wider transition-all ${
                ativo
                  ? "bg-creme-suave text-marrom-rustico" // Cor se estiver na página
                  : "text-cafe-expresso hover:bg-creme-suave hover:text-vermelho-pimenta" // Cor normal
              }`}
            >
              {link.nome}
            </Link>
          );
        })}
      </div>

      {/* Centro: Logo (A Imagem que você enviou) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-52 h-42 bg-creme-suave rounded-full border-4 border-creme-suave shadow-xl flex items-center justify-center overflow-hidden">
        <Link to="/" className="w-full h-full flex items-center justify-center">
           {/* A TAG DE IMAGEM DO REACT */}
          <img 
            src={logoPanelinhas} 
            alt="Logo Panelinhas.com" 
            className="h-full w-full object-cover scale-125" 
          />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-areia/50 border border-black/10 rounded-full px-4 py-1.5 w-64 focus-within:border-marrom-rustico transition-all">
          <input
            type="text"
            placeholder="Buscar lojas..."
            className="bg-transparent text-sm outline-none w-full text-cafe-expresso placeholder-marrom-rustico/50"
          />
        </div>
        
        <Link
          to="/login"
          className="px-5 py-1.5 rounded-full no-underline border-1.5 border-marrom-rustico text-marrom-rustico text-sm font-extrabold hover:bg-marrom-rustico hover:text-creme-suave transition-all"
        >
          Login
        </Link>
      </div>
      
    </nav>
  );
};