import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface SlideItem {
  id: number;
  pill: string;
  title: ReactNode;
  sub: string;
  cta: string;
  decoSm: string;
  decoBg: string;
  bgClass: string;
  onClick?: () => void;
}

const slides: SlideItem[] = [
  {
    id: 1,
    pill: "🔥 Oferta do Dia",
    title: (
      <>
        Até 40% off
        <br />
        em Alimentação
      </>
    ),
    sub: "Pizzas, lanches e doces com desconto especial hoje",
    cta: "Ver ofertas →",
    decoSm: "🔥",
    decoBg: "🍕",
    bgClass:
      "bg-gradient-to-br from-[#BF4A22] via-[#E87A50] to-[#F2A07A] text-white",
    onClick: () => console.log("Clicou na oferta do dia"),
  },
  {
    id: 2,
    pill: "⭐ Mais Visitada",
    title: (
      <>
        Pizzaria do Zé
        <br />
        em alta esta semana
      </>
    ),
    sub: "4.8 estrelas · 127 seguidores · Aberta agora",
    cta: "Visitar loja →",
    decoSm: "⭐",
    decoBg: "🏆",
    bgClass:
      "bg-gradient-to-br from-[#6D28D9] via-[#8B5CF6] to-[#C4B5FD] text-white",
    onClick: () => {
      if (typeof window !== "undefined" && (window as any).goToStore) {
        (window as any).goToStore();
      } else {
        console.log("Clicou na Pizzaria do Zé");
      }
    },
  },
  {
    id: 3,
    pill: "🛍️ Novidade",
    title: (
      <>
        Nova coleção
        <br />
        chegou à Moda Ana
      </>
    ),
    sub: "Peças exclusivas de verão — estoque limitado",
    cta: "Conferir →",
    decoSm: "🛍️",
    decoBg: "👗",
    bgClass:
      "bg-gradient-to-br from-[#0F6E56] via-[#1D9E75] to-[#5DCAA5] text-white",
    onClick: () => console.log("Clicou na novidade"),
  },
  {
    id: 4,
    pill: "📰 Notícia",
    title: (
      <>
        3 novas lojas
        <br />
        abriram no centro!
      </>
    ),
    sub: "Padaria artesanal, brechó premium e pet shop chegaram",
    cta: "Saiba mais →",
    decoSm: "📰",
    decoBg: "🗞️",
    bgClass:
      "bg-gradient-to-br from-[#1E6FA8] via-[#378ADD] to-[#85B7EB] text-white",
    onClick: () => console.log("Clicou na notícia"),
  },
];

/* ===================== CORES DA LOJA (primária + secundária) ===================== */

/**
 * Recebe duas cores (hex) escolhidas pelo dono da loja e gera todos os
 * tons necessários pra montar a fachada do prédio.
 *
 * - primary:   cor mais "viva", usada no toldo, vidro iluminado e texto da placa
 * - secondary: cor mais "clara", usada na parede do prédio
 *
 * Pode ser reaproveitada depois num formulário de "Criar loja", onde a
 * pessoa só escolhe essas 2 cores num color picker.
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
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

export interface BuildingColors {
  wallBg: string;
  awningBg: string;
  signColor: string;
  winBorder: string;
  winLit: string;
  doorBorder: string;
  doorBg: string;
}

export function buildLojaColors(
  primary: string,
  secondary: string,
): BuildingColors {
  return {
    wallBg: lighten(secondary, 0.45), // parede sempre pastel, mesmo se a cor escolhida for forte
    awningBg: primary, // toldo usa a cor primária direto
    signColor: lighten(primary, 0.6), // placa precisa ficar clara em cima do fundo escuro
    winBorder: darkenAlpha(primary, 0.3, 0.2),
    winLit: lightenAlpha(primary, 0.35, 0.65),
    doorBorder: darkenAlpha(primary, 0.3, 0.2),
    doorBg: darkenAlpha(primary, 0.5, 0.09),
  };
}

/* ===================== LOJAS (cenário de rua) ===================== */

interface Loja {
  id: number;
  name: string;
  category: string;
  emoji: string;
  rating: number;
  followers: number;
  isOpen: boolean;
  tall?: boolean;
  windows: boolean[]; // janelas acesas (true) ou apagadas (false)
  primary: string; // cor escolhida pelo dono da loja (vibrante)
  secondary: string; // cor escolhida pelo dono da loja (clara)
}

const lojas: Loja[] = [
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
  },
  {
    id: 2,
    name: "Moda Feminina Ana",
    category: "👗 Moda",
    emoji: "👗",
    rating: 4.6,
    followers: 89,
    isOpen: true,
    windows: [false, true, false],
    primary: "#9B59D0",
    secondary: "#EDD8F8",
  },
  {
    id: 3,
    name: "TechShop Eletrônicos",
    category: "💻 Eletrônicos",
    emoji: "💻",
    rating: 4.7,
    followers: 234,
    isOpen: true,
    tall: true,
    windows: [true, true, false],
    primary: "#3F7FD1",
    secondary: "#C8DDF8",
  },
  {
    id: 4,
    name: "Beleza Natural",
    category: "💄 Beleza",
    emoji: "💄",
    rating: 4.9,
    followers: 312,
    isOpen: false,
    windows: [false, true, false],
    primary: "#D9568C",
    secondary: "#FFD8E8",
  },
  {
    id: 5,
    name: "Artesanato Mineiro",
    category: "🏺 Artesanato",
    emoji: "🏺",
    rating: 4.5,
    followers: 56,
    isOpen: true,
    windows: [false, true, false],
    primary: "#4F9C42",
    secondary: "#D4EEC8",
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
  },
  {
    id: 7,
    name: "Pet Amor",
    category: "🐾 Pet",
    emoji: "🐾",
    rating: 4.4,
    followers: 41,
    isOpen: true,
    windows: [false, true, false],
    primary: "#5878C0",
    secondary: "#D8E8F8",
  },
  {
    id: 8,
    name: "Livraria Cultura",
    category: "📚 Livros",
    emoji: "📚",
    rating: 4.7,
    followers: 93,
    isOpen: false,
    windows: [true, false, true],
    primary: "#A06820",
    secondary: "#F0DEBA",
  },
];

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
  [0, 20, 60, 60, 0.18],
  [15, 5, 30, 75, 0.18],
  [80, 30, 50, 50, 0.15],
  [90, 10, 20, 70, 0.15],
  [160, 35, 70, 45, 0.13],
  [250, 15, 40, 65, 0.15],
  [310, 28, 55, 52, 0.12],
  [380, 8, 25, 72, 0.18],
  [420, 32, 65, 48, 0.13],
  [500, 18, 45, 62, 0.15],
  [560, 25, 80, 55, 0.12],
  [650, 5, 30, 75, 0.18],
  [700, 30, 60, 50, 0.13],
  [780, 12, 50, 68, 0.15],
  [840, 35, 70, 45, 0.12],
  [930, 20, 40, 60, 0.15],
  [990, 10, 55, 70, 0.18],
  [1060, 28, 65, 52, 0.13],
  [1140, 5, 35, 75, 0.18],
  [1190, 32, 80, 48, 0.12],
  [1290, 15, 50, 65, 0.15],
  [1360, 25, 80, 55, 0.13],
];

const Cloud = ({ className }: { className: string }) => (
  <div className={`absolute ${className}`}>
    <div className="absolute inset-0 bg-white/90 rounded-full" />
    <div className="absolute -top-1/2 left-[10%] w-[45%] h-[150%] bg-white/90 rounded-full" />
    <div className="absolute -top-[40%] left-[42%] w-[35%] h-[120%] bg-white/90 rounded-full" />
  </div>
);

const StreetBuilding = ({ loja }: { loja: Loja }) => {
  const c = buildLojaColors(loja.primary, loja.secondary);

  return (
    <Link
      to={`/loja/${loja.id}`}
      className="flex-shrink-0 w-[174px] px-1.5 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2 group"
    >
      {/* Placa */}
      <div
        className="relative z-10 w-[162px] max-w-[162px] text-center text-[11.5px] font-bold px-3 py-1.5 rounded-t-md whitespace-nowrap overflow-hidden text-ellipsis tracking-wide bg-[#2A1F14]"
        style={{ fontFamily: "Fraunces, Georgia, serif", color: c.signColor }}
      >
        {loja.name}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#2A1F14]" />
      </div>

      {/* Corpo do prédio */}
      <div className="w-[162px] mt-2 rounded-t-md overflow-hidden relative shadow-[-2px_0_8px_rgba(0,0,0,0.08),2px_0_8px_rgba(0,0,0,0.06)] transition-shadow duration-300 group-hover:shadow-[-4px_0_16px_rgba(0,0,0,0.13),4px_0_16px_rgba(0,0,0,0.1)]">
        {/* Janelas */}
        <div
          className={`flex justify-center gap-2 px-3 ${loja.tall ? "pt-5" : "pt-3"} pb-1.5`}
          style={{ background: c.wallBg }}
        >
          {loja.windows.map((lit, i) => (
            <div
              key={i}
              className="w-[26px] h-7 rounded-t-sm border-2 flex-shrink-0"
              style={{
                borderColor: c.winBorder,
                background: lit ? c.winLit : "rgba(255,255,255,.55)",
              }}
            />
          ))}
        </div>

        {/* Toldo */}
        <div
          className="h-[22px] -mx-px relative overflow-hidden"
          style={{ background: c.awningBg }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-[7px]"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 13px, transparent 13px, transparent 26px)",
            }}
          />
        </div>

        {/* Porta + emoji */}
        <div
          className="px-3 pt-2 flex items-end justify-center gap-2.5"
          style={{ background: c.wallBg }}
        >
          <span className="text-[30px] leading-none mb-1">{loja.emoji}</span>
          <div
            className="w-[34px] h-[46px] rounded-t-[4px] border-2 flex-shrink-0"
            style={{ borderColor: c.doorBorder, background: c.doorBg }}
          />
        </div>
      </div>

      {/* Faixa de info */}
      <div className="w-[162px] bg-white rounded-b px-2.5 py-1.5 flex items-center justify-between text-[10.5px] font-semibold text-[#6B5040] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <span>
          <span className="text-[#C88C10]">★</span> {loja.rating}
        </span>
        <span>{loja.followers} seguidores</span>
      </div>
      <span
        className={`mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
          loja.isOpen
            ? "bg-[#EAF3DE] text-[#3B6D11]"
            : "bg-[#F1EFE8] text-[#5F5E5A]"
        }`}
      >
        {loja.isOpen ? "Aberto" : "Fechado"}
      </span>
    </Link>
  );
};

const INTERVAL = 5000;

export const Home = () => {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [categoriaAtiva, setCategoriaAtiva] = useState("🏪 Todas");
  const [progresso, setProgresso] = useState(0);
  const rafRef = useRef<number>();
  const elapsedRef = useRef(0);
  const lastRef = useRef<number | undefined>(undefined);

  const goTo = (n: number) => {
    setIndiceAtivo((n + slides.length) % slides.length);
    elapsedRef.current = 0;
    lastRef.current = undefined;
  };

  useEffect(() => {
    const tick = (now: number) => {
      if (lastRef.current === undefined) lastRef.current = now;
      elapsedRef.current += now - lastRef.current;
      lastRef.current = now;
      const pct = Math.min((elapsedRef.current / INTERVAL) * 100, 100);
      setProgresso(pct);
      if (elapsedRef.current >= INTERVAL) {
        elapsedRef.current = 0;
        lastRef.current = undefined;
        setIndiceAtivo((prev) => (prev + 1) % slides.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    lastRef.current = undefined;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [indiceAtivo]);

  const lojasFiltradas = lojas.filter((loja) => {
    if (categoriaAtiva === "🏪 Todas") return true;
    if (categoriaAtiva === "🌱 Aberto agora") return loja.isOpen;
    return loja.category === categoriaAtiva;
  });

  const btnSeta =
    "absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full " +
    "flex items-center justify-center text-xl font-bold text-white " +
    "bg-black/30 hover:bg-black/50 backdrop-blur-sm " +
    "border border-white/20 transition-all duration-200 cursor-pointer shadow-md";

  return (
    <div className="w-full mx-auto pb-4 space-y-5 select-none text-slate-800">
      {/* ===================== CARROSSEL ===================== */}
      <div className="relative h-[300px] w-full shadow-xl overflow-hidden ">
        <div
          className="flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(.4,0,.2,1)]"
          style={{ transform: `translateX(-${indiceAtivo * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full h-full flex items-center justify-center px-16 relative overflow-hidden ${slide.bgClass}`}
            >
              <div className="relative z-10 max-w-md flex flex-col justify-center items-center text-center space-y-3 h-full py-4">
                <span className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {slide.pill}
                </span>
                <h2 className="text-[2rem] font-extrabold leading-tight drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-sm opacity-85 leading-relaxed">
                  {slide.sub}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={slide.onClick || (() => {})}
                    className="inline-flex items-center bg-white text-slate-900 font-bold px-6 py-2.5 rounded-full text-xs tracking-wide shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(indiceAtivo - 1)}
          className={`${btnSeta} left-3`}
          aria-label="Slide anterior"
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={() => goTo(indiceAtivo + 1)}
          className={`${btnSeta} right-3`}
          aria-label="Próximo slide"
        >
          &gt;
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === indiceAtivo
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 h-[3px] bg-white/50 z-20"
          style={{ width: `${progresso}%`, transition: "none" }}
        />
      </div>

      {/* ===================== CHIPS DE CATEGORIA ===================== */}
      <div className="bg-white border-b border-black/[0.08] py-3.5 px-7 flex items-center gap-2.5 flex-wrap">
        <span className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#9E8878] whitespace-nowrap">
          Tipo de loja
        </span>
        <div className="flex gap-2 flex-wrap">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaAtiva(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold border-[1.5px] transition-all duration-200 cursor-pointer ${
                cat === categoriaAtiva
                  ? "bg-[#D85A30] text-white border-[#D85A30]"
                  : "bg-[#F2EDE6] text-[#6B5040] border-black/[0.08] hover:border-[#D85A30] hover:text-[#D85A30] hover:bg-[#FAECE7]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== CENÁRIO DE RUA ===================== */}
      <section className="relative overflow-hidden">
        <div
          className="relative overflow-hidden flex items-end min-h-[320px] px-7"
          style={{
            background:
              "linear-gradient(180deg, #7FC8E8 0%, #B8E0F5 40%, #D8EEF8 100%)",
          }}
        >
          {/* Sol */}
          <div
            className="absolute right-[90px] top-[22px] w-14 h-14 rounded-full z-[1]"
            style={{
              background:
                "radial-gradient(circle at 40% 40%, #FFE888, #FFB820)",
              boxShadow:
                "0 0 0 12px rgba(255,210,60,.15), 0 0 0 28px rgba(255,210,60,.07)",
            }}
          />

          {/* Nuvens */}
          <Cloud className="top-8 left-[12%] w-[90px] h-7" />
          <Cloud className="top-[55px] left-[38%] w-[70px] h-[22px]" />
          <Cloud className="top-7 left-[65%] w-[110px] h-[34px]" />

          {/* Silhueta de prédios distantes */}
          <svg
            className="absolute bottom-0 left-0 right-0 h-20 z-[1] pointer-events-none"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {skylineRects.map(([x, y, w, h, o], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={`rgba(100,130,160,${o})`}
                rx={2}
              />
            ))}
          </svg>

          {/* Linha de prédios/lojas */}
          <div className="flex items-end w-full overflow-x-auto relative z-[3] scrollbar-none">
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
        <div
          className="relative z-[3] h-[54px] flex items-center px-7 border-t-[3px]"
          style={{
            background: "linear-gradient(180deg, #D4C4A8 0%, #C0B09A 100%)",
            borderTopColor: "#D8C8B0",
          }}
        >
          <div className="flex w-full items-end overflow-x-auto scrollbar-none">
            {sidewalkItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[174px] flex justify-center px-1.5"
              >
                <span className="text-3xl leading-none drop-shadow-md">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rua */}
        <div className="relative h-9 z-[2]" style={{ background: "#5E7080" }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1"
            style={{
              background:
                "repeating-linear-gradient(90deg, #FFE066 0, #FFE066 40px, transparent 40px, transparent 80px)",
            }}
          />
        </div>
      </section>
    </div>
  );
};
