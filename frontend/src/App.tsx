import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loja } from "./pages/Loja";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./components/Home";
import { CadastroLoja } from "./pages/CadastroLoja";
import { MinhasLojas } from "./pages/MinhasLojas";
import { Explore } from "./pages/Explore"
import { Perfil } from "./pages/Perfil";
import { ProdutosFavoritos } from "./pages/ProdutosFavoritos";

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
            <Route path="/explore" element={<Explore />} />
          </Route>

          {/* BLOCO 3: Rotas Privadas (Protegidas por Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/minhas-lojas" element={<MinhasLojas />} />
            <Route path="/cadastro-loja" element={<CadastroLoja />} />
            <Route path="/editar-loja/:id" element={<CadastroLoja />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/produtos-favoritos" element={<ProdutosFavoritos/>} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;