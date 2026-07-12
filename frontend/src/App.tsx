import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loja } from "./pages/Loja";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./components/Home";
import { CadastroLoja } from "./pages/CadastroLoja";
import { MinhasLojas } from "./pages/MinhasLojas";
import { Perfil } from "./pages/Perfil";

// 1. Layout Base
const LayoutComNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

// 2. Proteção de Rotas
export const ProtectedRoute = () => {
  const user = localStorage.getItem("Panelinha_user");
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// 3. Componente auxiliar para limpar a leitura do Router
const PaginaInicial = () => (
  <div>
    <Home />
    <main className="p-8">
      <h1 className="text-2xl font-bold text-[#2A1F14]">
        Bem-vindo ao Panelinhas!
      </h1>
      <p className="text-[#6B5040]">
        A rua das lojas locais começa aqui.
      </p>
    </main>
  </div>
);

// 4. Arquitetura de Rotas
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-creme-suave">
        <Routes>
          
          {/* BLOCO 1: Rotas Públicas (Sem Layout / Sem Navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rota da Loja isolada para não herdar a Navbar */}
          <Route path="/loja/:id" element={<Loja />} />

          {/* BLOCO 2: Rotas Públicas (Com Navbar) */}
          <Route element={<LayoutComNavbar />}>
            <Route path="/" element={<PaginaInicial />} />
          </Route>

          {/* BLOCO 3: Rotas Privadas (Protegidas por Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<div>Aqui vai a página do Feed</div>} />
            <Route path="/minhas-lojas" element={<MinhasLojas />} />
            <Route path="/cadastro-loja" element={<CadastroLoja />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;