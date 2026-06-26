import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewPredioLoja } from "../components/NewPredioLoja";

const EMOJIS_POR_CATEGORIA: Record<string, string[]> = {
    Alimentação: ["🍕", "🍔", "🥐", "🍩", "🍣", "🍦", "🎂", "☕", "🍺"],
    Moda: ["👗", "👕", "👜", "👠", "👟", "🧢", "🕶️", "🧥", "🧣"],
    Eletrônicos: ["💻", "📱", "🎮", "🎧", "📺", "⌚", "⌨️", "📷"],
    Beleza: ["💄", "💅", "💈", "🧴", "🧼", "🎨", "✨"],
    Artesanato: ["🏺", "🧶", "🎨", "🧵", "🪵", "🧱", "🌻"],
};

export const CadastroLoja = () => {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("Alimentação");
    const [descricao, setDescricao] = useState("");
    const [corPrimaria, setCorPrimaria] = useState("#D85A30");
    const [corSecundaria, setCorSecundaria] = useState("#FAF7F4");
    const [emoji, setEmoji] = useState("🍕");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const handleCategoriaChange = (novaCategoria: string) => {
        setCategoria(novaCategoria);
        const novosEmojis = EMOJIS_POR_CATEGORIA[novaCategoria] || ["🏪"];
        setEmoji(novosEmojis[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("Panelinha_user") || "{}");

        const dadosDaLoja = {
            name: nome,
            category: `🍽️ ${categoria}`,
            emoji: emoji,
            description: descricao,
            primary: corPrimaria,
            secondary: corSecundaria,
            userId: user.id || user.email || null,
            rating: 5.0,
            followers: 0,
            isOpen: true,
            windows: [true, false, true]
        };

        try {
            const res = await fetch("http://localhost:8000/api/lojas/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosDaLoja),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Erro ao cadastrar a loja.");
            }

            navigate("/minhas-lojas");
        } catch (err: any) {
            console.error("Erro no cadastro:", err);
            setErro(err.message || "Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-20 px-6 pb-12 font-nunito">
            <button
                onClick={() => navigate("/minhas-lojas")}
                className="flex items-center gap-2 text-sm font-bold text-marrom-rustico/60 hover:text-vermelho-pimenta transition-colors mb-6 cursor-pointer"
            >
                ← Voltar para Minhas Lojas
            </button>

            <h1 className="text-3xl font-extrabold text-[#2A1F14] mb-2" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
                Construa sua Fachada
            </h1>
            <p className="text-[#6B5040] mb-8">Escolha as características e pinte o prédio que representará sua loja na rua.</p>

            {erro && <p className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-3 rounded-xl border border-red-200">{erro}</p>}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-md border border-marrom-rustico/10">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="nome" className="text-xs font-bold uppercase text-marrom-rustico/70">Nome da Loja:</label>
                        <input
                            type="text"
                            id="nome"
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-[#D85A30]"
                            placeholder="Ex: Pastelaria do Zé"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="categoria" className="text-xs font-bold uppercase text-marrom-rustico/70">Categoria:</label>
                        <select
                            id="categoria"
                            value={categoria}
                            onChange={(e) => handleCategoriaChange(e.target.value)} // Atualizado para rodar a troca inteligente de emoji
                            className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-[#D85A30]"
                        >
                            <option value="Alimentação">Alimentação</option>
                            <option value="Moda">Moda</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Beleza">Beleza</option>
                            <option value="Artesanato">Artesanato</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-marrom-rustico/70">Escolha o Ícone da sua Vitrine:</label>
                        <div className="flex gap-2 flex-wrap bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl p-3">
                            {(EMOJIS_POR_CATEGORIA[categoria] || ["🏪"]).map((opçãoEmoji) => (
                                <button
                                    key={opçãoEmoji}
                                    type="button"
                                    onClick={() => setEmoji(opçãoEmoji)}
                                    className={`text-2xl p-2 rounded-xl transition-all hover:scale-110 cursor-pointer ${emoji === opçãoEmoji ? "bg-[#D85A30]/10 border-2 border-[#D85A30]" : "bg-white border border-black/[0.05] hover:bg-gray-50"
                                        }`}
                                >
                                    {opçãoEmoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="descricao" className="text-xs font-bold uppercase text-marrom-rustico/70">Descrição da Loja:</label>
                        <textarea
                            id="descricao"
                            required
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-4 py-2 text-sm text-cafe-expresso outline-none focus:border-[#D85A30] resize-none"
                            placeholder="Conte um pouco sobre sua loja, produtos ou serviços."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="corPrimaria" className="text-xs font-bold uppercase text-marrom-rustico/70">Cor do Toldo:</label>
                            <div className="flex items-center gap-2 bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-3 py-1">
                                <input
                                    type="color"
                                    id="corPrimaria"
                                    value={corPrimaria}
                                    onChange={(e) => setCorPrimaria(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                                <span className="text-xs font-mono text-cafe-expresso uppercase">{corPrimaria}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="corSecundaria" className="text-xs font-bold uppercase text-marrom-rustico/70">Cor da Parede:</label>
                            <div className="flex items-center gap-2 bg-[#FAF7F4] border border-[#E2D8D0] rounded-xl px-3 py-1">
                                <input
                                    type="color"
                                    id="corSecundaria"
                                    value={corSecundaria}
                                    onChange={(e) => setCorSecundaria(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                                <span className="text-xs font-mono text-cafe-expresso uppercase">{corSecundaria}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#D85A30] text-white font-bold py-3 rounded-xl hover:bg-[#BF4A22] transition-colors shadow-md disabled:bg-gray-400 cursor-pointer text-sm"
                    >
                        {loading ? "Inaugurando Loja..." : "Inaugurar Minha Loja! 🚀"}
                    </button>
                </form>

                <div className="md:col-span-2 bg-gradient-to-b from-[#7FC8E8] to-[#D8EEF8] border border-marrom-rustico/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[340px] shadow-inner relative overflow-hidden">
                    <span className="absolute top-3 left-4 text-[10px] font-extrabold uppercase tracking-widest text-sky-950/50">
                        Visualização na Rua
                    </span>

                    <div className="scale-125 transform origin-center transition-all duration-300">
                        <NewPredioLoja
                            loja={{
                                id: 0,
                                name: nome,
                                category: categoria,
                                emoji: emoji,
                                rating: 5.0,
                                followers: 0,
                                isOpen: true,
                                windows: [true, false, true],
                                primary: corPrimaria,
                                secondary: corSecundaria
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};