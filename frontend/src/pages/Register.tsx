import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_branco.svg";

export const Register = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("cliente"); // NOVO ESTADO
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOVO: Enviando o tipo de usuário para o Django
        body: JSON.stringify({ nome, email, senha, confirmarSenha, tipo_usuario: tipoUsuario }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.detail || "Erro ao criar conta.");
        return;
      }

      setSucesso("Conta criada com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Laranja Omitido por brevidade (Mantenha o seu exatamente igual) */}
      <div className="hidden md:flex w-5/12 bg-[#D85A30] flex-col items-center justify-center gap-6 p-10">
          <img src={logo} alt="Logo Panelinhas" className="h-40 w-auto" />
          {/* ... resto do seu código lateral ... */}
      </div>

      <div className="flex-1 bg-white flex flex-col justify-center p-10">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Criar conta</h1>
            <p className="text-sm text-gray-400 mt-1">Preencha os dados para se cadastrar</p>
          </div>

          {erro && <div className="w-full px-4 py-3 rounded-lg text-sm font-medium text-center bg-red-500/10 border border-red-400/30 text-red-400">{erro}</div>}
          {sucesso && <div className="w-full px-4 py-3 rounded-lg text-sm font-medium text-center bg-green-500/10 border border-green-400/30 text-green-500">{sucesso}</div>}

          <div className="flex flex-col gap-4">
            
            {/* NOVO: Seletor de Tipo de Conta */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">O que você deseja fazer no Panelinhas?</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setTipoUsuario("cliente")}
                  className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${tipoUsuario === "cliente" ? "bg-[#D85A30]/10 border-[#D85A30] text-[#D85A30]" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                >
                  👤 Sou Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setTipoUsuario("dono_loja")}
                  className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${tipoUsuario === "dono_loja" ? "bg-[#D85A30]/10 border-[#D85A30] text-[#D85A30]" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                >
                  🏪 Tenho uma Loja
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">Nome</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
                placeholder="Seu nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">Email</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">Senha</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
                    placeholder="••••••••"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">Confirmar</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
                    placeholder="••••••••"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister(e)}
                  />
                </div>
            </div>
          </div>

          <button onClick={handleRegister} disabled={loading} className="w-full mt-2 bg-[#D85A30] text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
          
          <p className="text-sm text-gray-400 text-center">
            Já tem uma conta? <Link to="/login" className="text-[#D85A30] hover:underline font-semibold">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
};