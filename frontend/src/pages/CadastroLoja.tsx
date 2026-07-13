import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NewPredioLoja, type LojaData } from "../components/PredioLoja";

const EMOJIS_POR_CATEGORIA: Record<string, string[]> = {
  "Alimentação": ["🍕", "🍔", "🥐", "🍩", "🍣", "🍦", "🎂", "☕", "🍺"],
  "Moda": ["👗", "👕", "👜", "👠", "👟", "🧢", "🕶️", "🧥", "🧣"],
  "Eletrônicos": ["💻", "📱", "🎮", "🎧", "📺", "⌚", "⌨️", "📷"],
  "Beleza": ["💄", "💅", "💈", "🧴", "🧼", "🎨", "✨"],
  "Artesanato": ["🏺", "🧶", "🎨", "🧵", "🪵", "🧱", "🌻"],
  "Outros": ["🏪", "🛍️", "🛒", "🔧", "📦", "🏢", "✨", "💡"]
};

export const CadastroLoja = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Pega o ID se estiver editando
  const isEditMode = !!id;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Alimentação");
  const [descricao, setDescricao] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS_POR_CATEGORIA["Alimentação"][0]); 
  const [corPrimaria, setCorPrimaria] = useState("#D85A30");
  const [corSecundaria, setCorSecundaria] = useState("#F3E5D8");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState(false); // Para impedir edição se não for o dono

  useEffect(() => {
    if (isEditMode) {
      buscarDadosDaLoja();
    }
  }, [id]);

  const buscarDadosDaLoja = async () => {
    try {
      setLoading(true);
      const userString = localStorage.getItem("Panelinha_user");
      const token = userString ? JSON.parse(userString).access : null;

      const resposta = await fetch(`http://localhost:8000/api/lojas/${id}/`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      
      if (!resposta.ok) throw new Error("Estabelecimento não encontrado");

      const dadosBackend = await resposta.json();

      // VERIFICAÇÃO DE SEGURANÇA: Só o dono pode editar
      let loggedInUserId = null;
      if (token) {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        loggedInUserId = decodedPayload.user_id || decodedPayload.id; 
      }

      if (String(dadosBackend.dono) !== String(loggedInUserId)) {
        setErro("Acesso Negado: Você não é o proprietário desta loja.");
        setBloqueado(true);
        return;
      }

      // Preenche os campos com os dados existentes
      setNome(dadosBackend.nome || "");
      setCategoria(dadosBackend.categoria || "Outros");
      setDescricao(dadosBackend.descricao || "");
      setEmoji(dadosBackend.emoji || "🏪");
      setCorPrimaria(dadosBackend.cor_primaria || "#D85A30");
      setCorSecundaria(dadosBackend.cor_secundaria || "#FAF7F4");
      setTelefone(dadosBackend.telefone || "");
      setEndereco(dadosBackend.endereco || "");
      
    } catch (err: any) {
      setErro(err.message);
      setBloqueado(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaCategoria = e.target.value;
    setCategoria(novaCategoria);
    const emojisDaCategoria = EMOJIS_POR_CATEGORIA[novaCategoria] || EMOJIS_POR_CATEGORIA["Outros"];
    setEmoji(emojisDaCategoria[0]);
  };

  const mascaraTelefone = (valor: string) => {
    let v = valor.replace(/\D/g, "");
    v = v.substring(0, 11);
    if (v.length <= 10) {
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return v;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(mascaraTelefone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bloqueado) return;

    setErro("");
    setLoading(true);

    try {
      const userString = localStorage.getItem("Panelinha_user");
      const token = userString ? JSON.parse(userString).access : null;

      if (!token) throw new Error("Você precisa estar logado.");

      const dadosDaLoja = {
        nome,
        categoria,
        descricao,
        emoji,
        cor_primaria: corPrimaria,
        cor_secundaria: corSecundaria,
        telefone, 
        endereco, 
      };

      // Se for edição manda PATCH para /lojas/id/, se for criação manda POST para /lojas/
      const url = isEditMode ? `http://localhost:8000/api/lojas/${id}/` : "http://localhost:8000/api/lojas/";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosDaLoja),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const mensagem = errorData.detail || (typeof errorData === 'object' ? Object.values(errorData)[0] : "Erro ao salvar a loja.");
        throw new Error(String(mensagem));
      }

      navigate("/minhas-lojas");
    } catch (err: any) {
      setErro(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const lojaPreview: LojaData = {
    id: 0,
    name: nome || "Nome da sua loja",
    category: categoria,
    emoji: emoji,
    rating: 5.0,
    followers: 0,
    isOpen: true,
    windows: [true, false, true, false],
    primary: corPrimaria,
    secondary: corSecundaria,
  };

  const listaEmojisAtual = EMOJIS_POR_CATEGORIA[categoria] || EMOJIS_POR_CATEGORIA["Outros"];

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-12 font-nunito">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase text-[#8C7361] hover:text-[#D85A30] mb-2 cursor-pointer">← Voltar</button>
          <h1 className="text-4xl font-extrabold text-[#2A1F14] mb-2" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
            {isEditMode ? "Editar Fachada" : "Construa sua Fachada"}
          </h1>
          <p className="text-[#6B5040] text-lg">
            {isEditMode ? "Atualize as características da sua loja." : "Escolha as características e pinte o prédio que representará sua loja."}
          </p>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-8 font-semibold">
          {erro}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        <form onSubmit={handleSubmit} className="flex-1 bg-white border border-[#E2D8D0] p-8 rounded-3xl shadow-sm space-y-6">
          
          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Nome da Loja</label>
            <input required disabled={bloqueado} type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30] disabled:opacity-50" placeholder="Ex: Padaria do João" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Telefone de Contato</label>
              <input type="text" disabled={bloqueado} value={telefone} onChange={handleTelefoneChange} maxLength={15} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30] disabled:opacity-50" placeholder="(00) 90000-0000" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Endereço Físico</label>
              <input type="text" disabled={bloqueado} value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30] disabled:opacity-50" placeholder="Rua das Flores, 123" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Categoria</label>
            <select disabled={bloqueado} value={categoria} onChange={handleCategoriaChange} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30] disabled:opacity-50">
              {Object.keys(EMOJIS_POR_CATEGORIA).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Descrição da Loja</label>
            <textarea required disabled={bloqueado} rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30] resize-none disabled:opacity-50" placeholder="Conte um pouco sobre o que sua loja oferece..." />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Ícone da Vitrine</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#FAF7F4] border border-[#E2D8D0] rounded-2xl min-h-19">
              {listaEmojisAtual.map((emj) => (
                <button key={emj} disabled={bloqueado} type="button" onClick={() => setEmoji(emj)} className={`w-12 h-12 text-2xl rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${emoji === emj ? "bg-white shadow-md border-2 border-[#D85A30]" : "hover:bg-white hover:scale-110"}`}>
                  {emj}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Cor Principal</label>
              <input type="color" disabled={bloqueado} value={corPrimaria} onChange={(e) => setCorPrimaria(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer disabled:opacity-50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">Cor Secundária</label>
              <input type="color" disabled={bloqueado} value={corSecundaria} onChange={(e) => setCorSecundaria(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer disabled:opacity-50" />
            </div>
          </div>

          <button type="submit" disabled={loading || bloqueado} className="w-full bg-[#D85A30] text-white font-black uppercase tracking-wider py-4 rounded-xl hover:bg-[#C24B24] transition-colors mt-6 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? "Salvando..." : (isEditMode ? "Salvar Alterações" : "Inaugurar Estabelecimento")}
          </button>
        </form>

        <div className="md:w-100 flex flex-col items-center">
          <div className="sticky top-24 w-full bg-linear-to-b from-sky-200 to-sky-100 rounded-3xl p-8 flex flex-col items-center justify-end h-122.5 shadow-inner border border-sky-300/30">
            <span className="text-[10px] font-black uppercase text-sky-800/40 tracking-widest absolute top-6">
              Visualização na Rua
            </span>
            <div className="scale-125 transform origin-bottom mt-auto">
              <NewPredioLoja loja={lojaPreview} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};