import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-black/10 px-7 flex items-center justify-between shadow-sm">
      {/* Esquerda: Links */}

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          to="/"
          className="px-4 py-1.5 rounded-full no-underline text-xs font-extrabold uppercase tracking-wider text-[#6B5040] hover:bg-[#FAECE7] hover:text-[#D85A30] transition-all"
        >
          Home
        </Link>
        <Link
          to="/explore"
          className="px-4 py-1.5 rounded-full no-underline text-xs font-extrabold uppercase tracking-wider text-[#6B5040] hover:bg-[#FAECE7] hover:text-[#D85A30] transition-all"
        >
          Explore
        </Link>
      </div>

      {/* Centro: Logo (Aquele círculo que você desenhou) */}
      <div className="flex flex-col items-center justify-center w-13 h-13 rounded-full bg-[#D85A30] border-3 border-[#993C1D] shadow-lg cursor-pointer hover:scale-105 hover:-rotate-3 transition-transform">
        <span className="text-[10px] font-bold text-[#FFE8B0] leading-none">
          PANELI-
        </span>
        <span className="text-lg leading-none">🍳</span>
        <span className="text-[10px] font-bold text-[#FFE8B0] leading-none">
          NHAS
        </span>
      </div>

      {/* Direita: Busca e Login */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-[#F2EDE6] border border-black/10 rounded-full px-4 py-1.5 w-64 focus-within:border-[#D85A30] transition-all">
          <span className="text-[#9E8878]">🔍</span>
          <input
            type="text"
            placeholder="Buscar lojas..."
            className="bg-transparent text-sm outline-none w-full text-[#2A1F14] placeholder-[#9E8878]"
          />
        </div>
        <Link
          to="/Login"
          className="px-5 py-1.5 rounded-full no-underline border-1.5 border-[#D85A30] text-[#D85A30] text-sm font-extrabold hover:bg-[#D85A30] hover:text-white transition-all"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};
