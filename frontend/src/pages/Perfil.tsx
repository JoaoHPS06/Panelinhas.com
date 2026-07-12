import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewPredioLoja, type LojaData } from "../components/PredioLoja";

export const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [lojasSeguidas, setLojasSeguidas] = useState<LojaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Puxa os dados do usuário logado
    const userString = localStorage.getItem("Panelinha_user");
    if (!userString) {
      navigate("/login");
      return;
    }
    
    const user = JSON.parse(userString);
    setUserData(user);

    // 2. Se for cliente, busca as lojas que ele segue
    if (user?.tipo_usuario === "cliente") {
      buscarLojasSeguidas(user.access);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const buscarLojasSeguidas = async (token: string) => {
    try {
      // Ajuste essa rota para o endpoint real do seu backend que lista as inscrições
      const res = await fetch("http://localhost:8000/api/minhas-inscricoes/", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const dados = await res.json();
        setLojasSeguidas(dados);
      }
    } catch (err) {
      console.error("Erro ao buscar lojas seguidas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Panelinha_user");
    navigate("/login");
  };

  if (!userData) return null;

  const isCliente = userData.tipo_usuario === "cliente";

  return (
    <div className="max-w-5xl mx-auto pt-28 px-6 pb-12 font-nunito min-h-screen">
      <div className="bg-white border border-marrom-rustico/10 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        
        {/* Avatar e Infos Básicas */}
        <div className="w-32 h-32 bg-areia/40 rounded-full flex items-center justify-center text-5xl font-bold text-marrom-rustico shrink-0">
          {userData.nome ? userData.nome[0].toUpperCase() : "👤"}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-creme-suave text-marrom-rustico text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            {isCliente ? "Conta de Cliente" : "Dono de Estabelecimento"}
          </div>
          <h1 className="text-3xl font-extrabold text-cafe-expresso mb-1">{userData.nome || "Usuário Panelinhas"}</h1>
          <p className="text-cafe-expresso/60 font-semibold">{userData.email || userData.username}</p>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-vermelho-pimenta/10 text-vermelho-pimenta hover:bg-vermelho-pimenta hover:text-white transition-colors font-bold px-6 py-2.5 rounded-full text-sm mt-4 md:mt-0"
        >
          Encerrar Sessão
        </button>
      </div>

      {/* Aba de Lojas Seguidas (Exclusiva para Clientes) */}
      {isCliente && (
        <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner relative overflow-hidden">
          <h2 className="text-xl font-extrabold text-marrom-rustico mb-6 border-b border-marrom-rustico/10 pb-4">
            Lojas que você segue
          </h2>

          {loading ? (
             <div className="text-center py-8 text-cafe-expresso/50 animate-pulse font-bold">Carregando a sua rua...</div>
          ) : lojasSeguidas.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-cafe-expresso/20 rounded-2xl">
              <span className="text-4xl mb-3 block">🚶</span>
              <p className="text-cafe-expresso/60 font-semibold mb-4">Você ainda não segue nenhum estabelecimento.</p>
              <button onClick={() => navigate("/")} className="bg-marrom-rustico text-white font-bold px-6 py-2 rounded-full text-sm">
                Explorar a Rua Principal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
              {lojasSeguidas.map((loja) => (
                <div key={loja.id} className="flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate(`/loja/${loja.id}`)}>
                  <NewPredioLoja loja={loja} />
                  <span className="text-xs font-bold text-cafe-expresso/70">{loja.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};