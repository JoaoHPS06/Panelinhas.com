export interface LojaData {
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
    description?: string;
}

interface PredioLojaProps {
    loja: LojaData;
}

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const bigint = parseInt(full, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function lighten(hex: string, amount: number): string {
    const [r, g, b] = hexToRgb(hex);
    const mix = (c: number) => Math.round(c + (255 - c) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function lightenAlpha(hex: string, amount: number, alpha: number): string {
    const [r, g, b] = hexToRgb(hex);
    const mix = (c: number) => Math.round(c + (255 - c) * amount);
    return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, ${alpha})`;
}

function darkenAlpha(hex: string, amount: number, alpha: number): string {
    const [r, g, b] = hexToRgb(hex);
    const mix = (c: number) => Math.round(c * (1 - amount));
    return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, ${alpha})`;
}

function buildLojaColors(primary: string, secondary: string) {
    return {
        wallBg: lighten(secondary, 0.45),
        awningBg: primary,
        signColor: lighten(primary, 0.6),
        winBorder: darkenAlpha(primary, 0.3, 0.2),
        winLit: lightenAlpha(primary, 0.35, 0.65),
        doorBorder: darkenAlpha(primary, 0.3, 0.2),
        doorBg: darkenAlpha(primary, 0.5, 0.09),
    };
}

export const NewPredioLoja = ({ loja }: PredioLojaProps) => {
    const c = buildLojaColors(loja.primary, loja.secondary);

    return (
        <div className="shrink-0 w-43.5 px-1.5 flex flex-col items-center select-none">
            <div className="relative z-10 w-40.5 max-w-40.5 text-center text-[11.5px] font-bold px-3 py-1.5 rounded-t-md whitespace-nowrap overflow-hidden text-ellipsis tracking-wide bg-[#2A1F14]" style={{ fontFamily: "Fraunces, Georgia, serif", color: c.signColor }}>
                {loja.name || "Minha Loja"}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#2A1F14]" />
            </div>

            <div className="w-40.5 mt-2 rounded-t-md overflow-hidden relative shadow-md">
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

            <div className="w-40.5 bg-white rounded-b px-2.5 py-1.5 flex items-center justify-between text-[10.5px] font-semibold text-[#6B5040] shadow-sm">
                <span><span className="text-[#C88C10]">★</span> {loja.rating}</span>
                <span>{loja.followers} seguidores</span>
            </div>
        </div>
    );
};