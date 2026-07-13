import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DadosPerfil {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
}

export const Perfil = () => {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState<DadosPerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Campos do formulário de informações pessoais
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // Alterar senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [loadingSenha, setLoadingSenha] = useState(false);

  const [loadingDelecao, setLoadingDelecao] = useState(false);

  const getToken = () => {
    const userString = localStorage.getItem("Panelinha_user");
    return userString ? JSON.parse(userString).access : null;
  };

  const buscarPerfil = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/perfil/", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Não foi possível carregar seu perfil.");

      const data = await res.json();
      setPerfil(data);
      setNome(data.nome || "");
      setEmail(data.email || "");
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar seus dados. Faça login novamente.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSalvarPerfil = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setSalvando(true);
    try {
      const res = await fetch("http://localhost:8000/api/perfil/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email })
      });

      if (res.ok) {
        const data = await res.json();
        setPerfil(data);
        alert("Dados atualizados com sucesso!");
      } else {
        const errorData = await res.json();
        alert(errorData.email?.[0] || errorData.nome?.[0] || "Erro ao salvar alterações.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setSalvando(false);
    }
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setLoadingSenha(true);
    try {
      const res = await fetch("http://localhost:8000/api/perfil/senha/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          senha_atual: senhaAtual,
          nova_senha: novaSenha,
          confirmar_nova_senha: confirmarNovaSenha
        })
      });

      if (res.ok) {
        alert("Senha alterada com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarNovaSenha("");
        setMostrarSenha(false);
      } else {
        const errorData = await res.json();
        alert(
          errorData.detail ||
          errorData.nova_senha?.[0] ||
          errorData.confirmar_nova_senha?.[0] ||
          "Erro ao alterar a senha."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleSair = () => {
    localStorage.removeItem("Panelinha_user");
    navigate("/login");
  };

  const handleDeletarConta = async () => {
    if (!confirm("Tem certeza absoluta? Essa ação não pode ser desfeita.")) return;

    const senha = prompt("Por segurança, digite sua senha para confirmar a exclusão:");
    if (!senha) return;

    const token = getToken();
    if (!token) return;

    setLoadingDelecao(true);
    try {
      const res = await fetch("http://localhost:8000/api/perfil/deletar/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ senha })
      });

      if (res.ok) {
        localStorage.removeItem("Panelinha_user");
        alert("Sua conta foi excluída.");
        navigate("/");
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Erro ao excluir a conta.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoadingDelecao(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-20">
      <h1 className="text-4xl font-black text-[#2A1F14] mb-8 font-serif">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* COLUNA 1: Avatar e Info Básica */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-[#E2D8D0] shadow-sm text-center">
          <div className="w-24 h-24 bg-[#FAF7F4] border-4 border-[#E2D8D0] rounded-full mx-auto flex items-center justify-center text-4xl mb-4">
            👤
          </div>
          <h2 className="font-bold text-[#2A1F14] text-lg">{perfil?.nome || "Usuário"}</h2>
          <p className="text-[#8C7361] text-sm mb-6">{perfil?.email}</p>
          <button
            disabled
            title="Ainda não temos upload de foto — pode ser um próximo passo"
            className="w-full py-2 bg-[#D85A30]/40 text-white font-bold rounded-xl cursor-not-allowed"
          >
            Editar Foto
          </button>
        </div>

        {/* COLUNA 2: Configurações de Conta */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSalvarPerfil} className="bg-white p-6 rounded-3xl border border-[#E2D8D0] shadow-sm">
            <h3 className="font-black text-[#2A1F14] mb-4">Informações Pessoais</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#8C7361]">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-[#8C7361]">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={salvando}
                className="bg-[#2A1F14] text-white font-bold px-6 py-2 rounded-xl hover:bg-[#4A3A2F] cursor-pointer disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>

          {/* Segurança */}
          <section className="bg-white p-6 rounded-3xl border border-[#E2D8D0] shadow-sm">
            <h3 className="font-black text-[#2A1F14] mb-4">Segurança</h3>

            {!mostrarSenha ? (
              <button
                onClick={() => setMostrarSenha(true)}
                className="text-[#D85A30] font-bold text-sm hover:underline cursor-pointer"
              >
                Alterar Senha
              </button>
            ) : (
              <form onSubmit={handleAlterarSenha} className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase text-[#8C7361]">Senha Atual</label>
                  <input
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#8C7361]">Nova Senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#8C7361]">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 mt-1"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarSenha(false);
                      setSenhaAtual("");
                      setNovaSenha("");
                      setConfirmarNovaSenha("");
                    }}
                    disabled={loadingSenha}
                    className="text-sm font-bold text-[#8C7361] hover:text-[#2A1F14] px-4 py-2 cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loadingSenha}
                    className="bg-[#D85A30] text-white font-bold px-6 py-2 rounded-xl hover:bg-[#C24B24] cursor-pointer disabled:opacity-50"
                  >
                    {loadingSenha ? "Salvando..." : "Salvar Nova Senha"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#F3E5D8]">
              <button
                onClick={handleSair}
                className="text-red-500 font-bold text-sm hover:text-red-700 cursor-pointer"
              >
                Sair da conta
              </button>
            </div>
          </section>

          {/* ZONA DE PERIGO */}
          <section className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm mt-6">
            <h3 className="font-black text-red-600 mb-2">Zona de Perigo</h3>
            <p className="text-[#8C7361] text-sm mb-4">
              Ao deletar sua conta, todos os seus dados, avaliações e progresso serão apagados permanentemente e não poderão ser recuperados.
            </p>
            <button
              onClick={handleDeletarConta}
              disabled={loadingDelecao}
              className="bg-red-500 text-white font-bold px-6 py-2 rounded-xl hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loadingDelecao ? "Excluindo..." : "Deletar minha conta"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};