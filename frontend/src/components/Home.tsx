import { ReactNode, useEffect, useRef, useState } from "react";

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

const categorias = [
  "🏪 Todas",
  "🍽️ Alimentação",
  "👗 Moda",
  "💻 Eletrônicos",
  "💄 Beleza",
  "🏺 Artesanato",
  "🌱 Aberto agora",
];

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

  const btnSeta =
    "absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full " +
    "flex items-center justify-center text-xl font-bold text-white " +
    "bg-black/30 hover:bg-black/50 backdrop-blur-sm " +
    "border border-white/20 transition-all duration-200 cursor-pointer shadow-md";

  return (
    <div className="w-full mx-auto pb-4 space-y-5 select-none text-slate-800">
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

      <div className="space-y-2 ml-4">
        <span className="text-[14px]  font-bold text-[#9E8878] uppercase tracking-widest block px-1">
          Tipo de loja
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaAtiva(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 flex-shrink-0 cursor-pointer ${
                cat === categoriaAtiva
                  ? "bg-[#D85A30] text-white border-[#D85A30]"
                  : "bg-[#FAF7F4] text-[#6B5040] border-[#E2D8D0] hover:bg-[#F2EDE6] hover:border-[#C9A898]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
