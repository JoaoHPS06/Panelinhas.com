import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const valorFormatado = mascaraTelefone(e.target.value);
    setTelefone(valorFormatado);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const userString = localStorage.getItem("Panelinha_user");
      const userData = userString ? JSON.parse(userString) : null;
      const token = userData?.access;

      if (!token) {
        throw new Error("Você precisa estar logado para inaugurar uma loja.");
      }

      const dadosDaLoja = {
        nome,
        categoria,
        descricao,
        emoji,
        cor_primaria: corPrimaria,
        cor_secundaria: corSecundaria,
        telefone, 
        endereco, 
        esta_aberta: true,
        janelas: [true, false, true, false]
      };

      const res = await fetch("http://localhost:8000/api/lojas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosDaLoja),
      });

      const textResponse = await res.text(); 
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Erro interno do servidor (500). Verifique o terminal do Django!");
      }

      if (!res.ok) {
        const mensagem = data.detail || (typeof data === 'object' ? Object.values(data)[0] : "Erro ao cadastrar a loja.");
        throw new Error(String(mensagem));
      }

      navigate("/minhas-lojas");
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
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
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#2A1F14] mb-2" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
          Construa sua Fachada
        </h1>
        <p className="text-[#6B5040] text-lg">
          Escolha as características, preencha os dados e pinte o prédio que representará sua loja na rua.
        </p>
      </div>

      {erro && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-8 font-semibold">
          {erro}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        <form onSubmit={handleSubmit} className="flex-1 bg-white border border-[#E2D8D0] p-8 rounded-3xl shadow-sm space-y-6">
          
          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
              Nome da Loja
            </label>
            <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30]" placeholder="Ex: Padaria do João" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
                Telefone de Contato
              </label>
              <input 
                type="text" 
                value={telefone} 
                onChange={handleTelefoneChange} 
                maxLength={15}
                className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30]" 
                placeholder="(00) 90000-0000" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
                Endereço Físico
              </label>
              <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30]" placeholder="Rua das Flores, 123" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
              Categoria
            </label>
            <select value={categoria} onChange={handleCategoriaChange} className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30]">
              {Object.keys(EMOJIS_POR_CATEGORIA).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* O CAMPO DE DESCRIÇÃO QUE FALTAVA */}
          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
              Descrição da Loja
            </label>
            <textarea 
              required 
              rows={3}
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D85A30] resize-none" 
              placeholder="Conte um pouco sobre o que sua loja oferece, seus diferenciais e especialidades..." 
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
              Ícone da Vitrine
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#FAF7F4] border border-[#E2D8D0] rounded-2xl min-h-19">
              {listaEmojisAtual.map((emj) => (
                <button key={emj} type="button" onClick={() => setEmoji(emj)} className={`w-12 h-12 text-2xl rounded-xl transition-all flex items-center justify-center cursor-pointer ${emoji === emj ? "bg-white shadow-md border-2 border-[#D85A30]" : "hover:bg-white hover:scale-110"}`}>
                  {emj}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
                Cor Principal
              </label>
              <input type="color" value={corPrimaria} onChange={(e) => setCorPrimaria(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#8C7361] tracking-wider mb-2 block">
                Cor Secundária
              </label>
              <input type="color" value={corSecundaria} onChange={(e) => setCorSecundaria(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#D85A30] text-white font-black uppercase tracking-wider py-4 rounded-xl hover:bg-[#C24B24] transition-colors mt-6 cursor-pointer">
            {loading ? "Construindo..." : "Inaugurar Estabelecimento"}
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