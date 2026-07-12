import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logoPanelinhas from "../assets/logo.png"; 

interface ItemDoMenu {
  nome: string;
  caminho: string;
}

export const Navbar = () => {
  const local = useLocation();
  const [isLogged, setIsLogged] = useState(false);
  const [isDonoDeLoja, setIsDonoDeLoja] = useState(false);

  useEffect(() => {
    // Busca e parseia o objeto do usuário salvo no login
    const userString = localStorage.getItem("Panelinha_user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setIsLogged(true);
        // Verifica o tipo de usuário retornado pelo backend (ajuste a chave se necessário)
        setIsDonoDeLoja(userData?.tipo_usuario === "dono_loja"); 
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e);
        setIsLogged(false);
      }
    } else {
      setIsLogged(false);
      setIsDonoDeLoja(false);
    }
  }, [local]);

  const handleLogout = () => {
    localStorage.removeItem("Panelinha_user");
    setIsLogged(false);
    setIsDonoDeLoja(false);
  }

  const links: ItemDoMenu[] = [
    { nome: "Home", caminho: "/" },
    { nome: "Explore", caminho: "/explore" },
  ];

  if (isLogged) {
    links.push({ nome: "Meu Feed", caminho: "/feed" });
    // Renderização condicional da aba Minhas Lojas
    if (isDonoDeLoja) {
      links.push({ nome: "Minhas Lojas", caminho: "/minhas-lojas" });
    }
  }

  return (
    <nav className="fixed top-14 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl h-16 rounded-full flex items-center justify-between px-8 z-50 backdrop-blur-md bg-creme-suave/70 border border-marrom-rustico/10 shadow-lg">

      <div className="flex gap-6 items-center font-nunito">
        {links.map((link, index) => {
          const ativo = local.pathname === link.caminho;

          return (
            <Link
              key={index}
              to={link.caminho}
              className={`px-4 py-1.5 rounded-full no-underline hover:underline hover:underline-offset-8 text-xs font-extrabold uppercase tracking-wider transition-all ${ativo
                ? "bg-creme-suave text-marrom-rustico" 
                : "text-cafe-expresso hover:bg-creme-suave hover:text-vermelho-pimenta" 
                }`}
            >
              {link.nome}
            </Link>
          );
        })}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 w-52 h-42 bg-creme-suave rounded-full border-4 border-creme-suave shadow-xl flex items-center justify-center overflow-hidden">
        <Link to="/" className="w-full h-full flex items-center justify-center">
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

        {isLogged && (
          <button
            onClick={handleLogout}
            className="px-5 py-1.5 rounded-full border-1.5 border-marrom-rustico text-marrom-rustico text-sm font-extrabold hover:bg-marrom-rustico hover:text-creme-suave transition-all cursor-pointer"
          >
            Sair
          </button>
        )}
        {!isLogged && (
          <Link
            to="/login"
            className="px-5 py-1.5 rounded-full no-underline border-1.5 border-marrom-rustico text-marrom-rustico text-sm font-extrabold hover:bg-marrom-rustico hover:text-creme-suave transition-all"
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
};