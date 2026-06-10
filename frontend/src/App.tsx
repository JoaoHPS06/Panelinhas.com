import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loja } from "./pages/Loja";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./components/Home";
import { useEffect, useState } from "react";

const LayoutComNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F2EDE6]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
