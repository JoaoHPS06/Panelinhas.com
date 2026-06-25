import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BotaoPrincipal } from "../components/BotaoPrincipal";
import { NewPredioLoja, type Loja } from "../components/NewPredioLoja";

const LOJAS_MOCK: Loja[] = [
    {
        id: 1,
        name: "Pizzaria do Zé",
        category: "🍽️ Alimentação",
        emoji: "🍕",
        rating: 4.8,
        followers: 127,
        isOpen: true,
        windows: [true, false, true],
        primary: "#E2703A",
        secondary: "#FFD9A8",
        description: "A melhor pizza de fermentação natural da rua virtual!"
    },
    {
        id: 6,
        name: "Padaria Estrela",
        category: "🍽️ Alimentação",
        emoji: "🥐",
        rating: 4.8,
        followers: 178,
        isOpen: true,
        windows: [true, false, true],
        primary: "#C99020",
        secondary: "#FFF2C4",
        description: "Pães quentinhos e doces artesanais saindo a toda hora."
    }
];

export const MinhasLojas = () => {
    const navigate = useNavigate();
    const [lojasDoUsuario, setLojasDoUsuario] = useState<Loja[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const temporizador = setTimeout(() => {
            setLojasDoUsuario(LOJAS_MOCK);
            setLoading(false);
        }, 800);

        return () => clearTimeout(temporizador);
    }, []);

    const totalSeguidores = lojasDoUsuario.reduce((acc, loja) => acc + loja.followers, 0);
    const mediaAvaliacao = lojasDoUsuario.length
        ? (lojasDoUsuario.reduce((acc, loja) => acc + loja.rating, 0) / lojasDoUsuario.length).toFixed(1)
        : "0.0";

    return (
        <div className="max-w-5xl mx-auto pt-20 px-6 pb-12 font-nunito min-h-screen space-y-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-marrom-rustico/10 pb-6">
                <div>
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-marrom-rustico/60 hover:text-vermelho-pimenta transition-colors mb-2 cursor-pointer"
                    >
                        ← Voltar para a rua
                    </button>
                    <h1 className="text-4xl font-extrabold text-[#2A1F14]" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
                        Minhas Lojas
                    </h1>
                    <p className="text-[#6B5040] text-sm mt-1">Gerencie seus negócios e veja como eles aparecem na nossa rua virtual.</p>
                </div>

                <div className="shrink-0">
                    <BotaoPrincipal
                        texto="+ Inaugurar Nova Loja"
                        onClick={() => navigate("/cadastro-loja")}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-marrom-rustico/70 animate-pulse font-bold">Carregando seus estabelecimentos...</p>
                </div>
            ) : (
                <>
                    {lojasDoUsuario.length === 0 ? (
                        <div className="bg-white border border-marrom-rustico/10 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto mt-10">
                            <span className="text-5xl block mb-4">🏪</span>
                            <h3 className="text-lg font-bold text-[#2A1F14] mb-1">Sua calçada está vazia</h3>
                            <p className="text-[#6B5040] text-sm mb-6">
                                Você ainda não construiu nenhuma fachada na nossa rua virtual. Que tal inaugurar o seu primeiro prédio agora?
                            </p>
                            <BotaoPrincipal
                                texto="Construir minha primeira loja"
                                onClick={() => navigate("/cadastro-loja")}
                            />
                        </div>
                    ) : (
                        <div className="space-y-8">

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white border border-marrom-rustico/10 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                    <span className="text-3xl bg-creme-suave p-3 rounded-xl">🏢</span>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">Total de Lojas</p>
                                        <p className="text-2xl font-black text-cafe-expresso">{lojasDoUsuario.length}</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-marrom-rustico/10 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                    <span className="text-3xl bg-creme-suave p-3 rounded-xl">👥</span>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">Seguidores Totais</p>
                                        <p className="text-2xl font-black text-cafe-expresso">{totalSeguidores}</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-marrom-rustico/10 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                    <span className="text-3xl bg-creme-suave p-3 rounded-xl">⭐</span>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-marrom-rustico/50 tracking-wider">Média de Avaliações</p>
                                        <p className="text-2xl font-black text-cafe-expresso">{mediaAvaliacao} <span className="text-xs font-normal text-marrom-rustico/60">/ 5.0</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#FAF7F4] border border-marrom-rustico/10 rounded-3xl p-8 shadow-inner relative overflow-hidden">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-marrom-rustico/40 block mb-6">
                                    Suas propriedades ativas na rua:
                                </span>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-6 justify-items-center">
                                    {lojasDoUsuario.map((loja) => (
                                        <div key={loja.id} className="relative group pb-4">
                                            <NewPredioLoja loja={loja} />

                                            <div className="absolute inset-x-0 -bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-center">
                                                <button
                                                    onClick={() => navigate(`/loja/${loja.id}`)}
                                                    className="bg-marrom-rustico text-white text-[11px] font-bold uppercase px-4 py-1.5 rounded-full shadow-md hover:bg-[#D85A30] transition-colors cursor-pointer"
                                                >
                                                    Gerenciar →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}
        </div>
    );
};