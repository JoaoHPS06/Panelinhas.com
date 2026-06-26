import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loja } from "./pages/Loja";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./components/Home";
import { CadastroLoja } from "./pages/CadastroLoja";
import { MinhasLojas } from "./pages/MinhasLojas";
//import { useEffect, useState } from "react";

const LayoutComNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export const ProtectedRoute = () => {
  const user = localStorage.getItem("Panelinha_user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-creme-suave">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<div>Aqui vai a página do Feed</div>} />
            <Route path="/minhas-lojas" element={<MinhasLojas />} />
            <Route path="/cadastro-loja" element={<CadastroLoja />} />
          </Route>

          <Route element={<LayoutComNavbar />}>
            <Route
              path="/"
              element={
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
              }
            />
            <Route path="/loja/:id" element={<Loja />} />

          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;