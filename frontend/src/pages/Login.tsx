//import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_branco.svg";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      // Ajuste a rota para a do seu backend (pode ser /api/token/ dependendo da config)
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Se o Django reclamar, mude 'email' para 'username' ou 'senha' para 'password'
        body: JSON.stringify({ email: email, password: senha }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.detail || "Email ou senha incorretos.");
        setLoading(false);
        return;
      }

      // Salva o objeto COMPLETO (com tokens e dados do usuário) no localStorage
      localStorage.setItem("Panelinha_user", JSON.stringify(data));
      navigate("/");

    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Não foi possível conectar ao servidor.");
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex">
      <div className="w-full flex">
        <div className="hidden md:flex w-5/12 bg-[#D85A30] flex-col items-center justify-center gap-6 p-10">
          <img src={logo} alt="Logo Panelinhas" className="h-40 w-auto" />
          <div className="text-center">
            <p className="text-white text-lg font-semibold">Panelinhas</p>
            <p className="text-white/60 text-sm mt-1 leading-relaxed">
              Conectando você aos melhores comércios locais
            </p>
          </div>
          <ul className="mt-2 flex flex-col gap-3 w-full ml-56">
            <li className="flex items-center gap-3 text-white/80 text-sm">
              <span>📍</span>
              <span>Comércios perto de você</span>
            </li>
            <li className="flex items-center gap-3 text-white/80 text-sm">
              <span>⭐</span>
              <span>Avaliações da comunidade</span>
            </li>
            <li className="flex items-center gap-3 text-white/80 text-sm">
              <span>🕐</span>
              <span>Horários atualizados</span>
            </li>
          </ul>
        </div>
        <div className="flex-1 bg-white flex flex-col justify-center p-10">
          <div className="w-full max-w-sm mx-auto flex flex-col gap-4">

            <h1 className="text-2xl font-semibold text-gray-900">Entrar</h1>

            {erro && (
              <div className="w-full px-4 py-3 rounded-lg text-sm font-medium text-center bg-red-500/10 border border-red-400/30 text-red-400">
                {erro}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Senha</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
                  placeholder="••••••••"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-2 bg-[#D85A30] text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p className="text-sm text-gray-400 text-center">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-[#D85A30] hover:underline font-semibold">
                Cadastrar-se
              </Link>
            </p>

            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Voltar para o início
              </button>
            </div>

          </div>
        </div>
      </div>
    </div >
  )
};
