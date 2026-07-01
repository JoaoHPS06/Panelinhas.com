import { useState } from "react";
import { Link } from "react-router-dom";
import { buildLojaColors } from "../utils/colorUtils";

/* ===================== TIPAGENS ===================== */
export interface Loja {
    id: number;
    name: string;
    category: string;
    emoji: string;
    rating: number;
    followers: number;
    isOpen: boolean;
    tall?: boolean;
    windows: boolean[];
    primary: string;
    secondary: string;
}


interface StoreStreetProps {
    listaDeLojas: Loja[];
}

/* ===================== CONSTANTES CENÁRIO ===================== */
const categorias = [
    "🏪 Todas",
    "🍽️ Alimentação",
    "👗 Moda",
    "💻 Eletrônicos",
    "💄 Beleza",
    "🏺 Artesanato",
    "🐾 Pet",
    "📚 Livros",
    "🌱 Aberto agora",
];

const sidewalkItems = ["🌳", "🕯️", "🌳", "🌳", "🕯️", "🌳", "🌳", "🕯️", "🌳"];

const skylineRects: [number, number, number, number, number][] = [
    [0, 20, 60, 60, 0.18], [15, 5, 30, 75, 0.18], [80, 30, 50, 50, 0.15],
    [90, 10, 20, 70, 0.15], [160, 35, 70, 45, 0.13], [250, 15, 40, 65, 0.15],
    [310, 28, 55, 52, 0.12], [380, 8, 25, 72, 0.18], [420, 32, 65, 48, 0.13],
    [500, 18, 45, 62, 0.15], [560, 25, 80, 55, 0.12], [650, 5, 30, 75, 0.18],
];

/* ===================== SUB-COMPONENTES ===================== */
const Cloud = ({ className }: { className: string }) => (
    <div className={`absolute ${className}`}>
        <div className="absolute inset-0 bg-white/90 rounded-full" />
        <div className="absolute -top-1/2 left-[10%] w-[45%] h-[150%] bg-white/90 rounded-full" />
        <div className="absolute top-[-40%] left-[42%] w-[35%] h-[120%] bg-white/90 rounded-full" />
    </div>
);

const StreetBuilding = ({ loja }: { loja: Loja }) => {
    const c = buildLojaColors(loja.primary, loja.secondary);
    return (
        <Link
            to={`/loja/${loja.id}`}
            className="shrink-0 w-43.5 px-1.5 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2 group"
        >
            <div className="relative z-10 w-40.5 max-w-40.5 text-center text-[11.5px] font-bold px-3 py-1.5 rounded-t-md whitespace-nowrap overflow-hidden text-ellipsis tracking-wide bg-[#2A1F14]" style={{ fontFamily: "Fraunces, Georgia, serif", color: c.signColor }}>
                {loja.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#2A1F14]" />
            </div>
            <div className="w-40.5 mt-2 rounded-t-md overflow-hidden relative shadow-[-2px_0_8px_rgba(0,0,0,0.08),2px_0_8px_rgba(0,0,0,0.06)] transition-shadow duration-300 group-hover:shadow-[-4px_0_16px_rgba(0,0,0,0.13),4px_0_16px_rgba(0,0,0,0.1)]">
                <div className={`flex justify-center gap-2 px-3 ${loja.tall ? "pt-5" : "pt-3"} pb-1.5`} style={{ background: c.wallBg }}>
                    {loja.windows.map((lit, i) => (
                        <div key={i} className="w-6.5 h-7 rounded-t-sm border-2 shrink-0" style={{ borderColor: c.winBorder, background: lit ? c.winLit : "rgba(255,255,255,.55)" }} />
                    ))}
                </div>
                <div className="h-5.5 -mx-px relative overflow-hidden" style={{ background: c.awningBg }}>
                    <div className="absolute bottom-0 left-0 right-0 h-1.75" style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 13px, transparent 13px, transparent 26px)" }} />
                </div>
                <div className="px-3 pt-2 flex items-end justify-center gap-2.5" style={{ background: c.wallBg }}>
                    <span className="text-[30px] leading-none mb-1">{loja.emoji}</span>
                    <div className="w-8.5 h-11.5 rounded-t-sm border-2 shrink-0" style={{ borderColor: c.doorBorder, background: c.doorBg }} />
                </div>
            </div>
            <div className="w-40.5 bg-white rounded-b px-2.5 py-1.5 flex items-center justify-between text-[10.5px] font-semibold text-[#6B5040] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                <span><span className="text-[#C88C10]">★</span> {loja.rating}</span>
                <span>{loja.followers} seguidores</span>
            </div>
            <span className={`mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${loja.isOpen ? "bg-[#EAF3DE] text-[#3B6D11]" : "bg-[#F1EFE8] text-[#5F5E5A]"}`}>
                {loja.isOpen ? "Aberto" : "Fechado"}
            </span>
        </Link>
    );
};

/* ===================== COMPONENTE PRINCIPAL ===================== */
export const Faixada = ({ listaDeLojas }: StoreStreetProps) => {
    const [categoriaAtiva, setCategoriaAtiva] = useState("🏪 Todas");

    // Realiza a filtragem dinamicamente baseado na categoria selecionada
    const lojasFiltradas = listaDeLojas.filter((loja) => {
        if (categoriaAtiva === "🏪 Todas") return true;
        if (categoriaAtiva === "🌱 Aberto agora") return loja.isOpen;
        return loja.category === categoriaAtiva;
    });

    return (
        <div className="space-y-5">
            {/* Chips de Categoria */}
            <div className="bg-white border-b border-black/8 py-3.5 px-7 flex flex-col items-start gap-3">

                {/* O título agora fica no topo sozinho, adicionado um leve margin-bottom se quiser espaçar mais */}
                <span className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#9E8878] whitespace-nowrap mb-1">
                    Tipo de loja
                </span>

                {/* Os botões continuam quebrando linha se faltar espaço na tela (flex-wrap) */}
                <div className="flex gap-2 flex-wrap">
                    {categorias.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoriaAtiva(cat)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold border-[1.5px] transition-all duration-200 cursor-pointer ${cat === categoriaAtiva
                                ? "bg-[#D85A30] text-white border-[#D85A30]"
                                : "bg-[#F2EDE6] text-[#6B5040] border-black/8 hover:border-[#D85A30] hover:text-[#D85A30] hover:bg-[#FAECE7]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cenário de Rua */}
            <section className="relative overflow-hidden">
                <div className="relative overflow-hidden flex items-end min-h-80 px-7" style={{ background: "linear-gradient(180deg, #7FC8E8 0%, #B8E0F5 40%, #D8EEF8 100%)" }}>
                    <div className="absolute right-22.5 top-5.5 w-14 h-14 rounded-full z-1" style={{ background: "radial-gradient(circle at 40% 40%, #FFE888, #FFB820)", boxShadow: "0 0 0 12px rgba(255,210,60,.15), 0 0 0 28px rgba(255,210,60,.07)" }} />
                    <Cloud className="top-8 left-[12%] w-22.5 h-7" />
                    <Cloud className="top-13.75 left-[38%] w-17.5 h-5.5" />
                    <Cloud className="top-7 left-[65%] w-27.5 h-8.5" />

                    <svg className="absolute bottom-0 left-0 right-0 h-20 z-1 pointer-events-none" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        {skylineRects.map(([x, y, w, h, o], i) => (
                            <rect key={i} x={x} y={y} width={w} height={h} fill={`rgba(100,130,160,${o})`} rx={2} />
                        ))}
                    </svg>

                    <div className="flex items-end w-full overflow-x-auto relative z-3 scrollbar-none">
                        {lojasFiltradas.map((loja) => (
                            <StreetBuilding key={loja.id} loja={loja} />
                        ))}
                        {lojasFiltradas.length === 0 && (
                            <p className="text-white/80 text-sm pb-10 px-2">
                                Nenhuma loja encontrada nessa categoria.
                            </p>
                        )}
                    </div>
                </div>

                {/* Calçada */}
                <div className="relative z-3 h-13.5 flex items-center px-7 border-t-[3px]" style={{ background: "linear-gradient(180deg, #D4C4A8 0%, #C0B09A 100%)", borderTopColor: "#D8C8B0" }}>
                    <div className="flex w-full items-end overflow-x-auto scrollbar-none">
                        {sidewalkItems.map((item, i) => (
                            <div key={i} className="shrink-0 w-43.5 flex justify-center px-1.5">
                                <span className="text-3xl leading-none drop-shadow-md">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rua */}
                <div className="relative h-9 z-2" style={{ background: "#5E7080" }}>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1" style={{ background: "repeating-linear-gradient(90deg, #FFE066 0, #FFE066 40px, transparent 40px, transparent 80px)" }} />
                </div>
            </section>
        </div>
    );
};