import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loja } from "./pages/Loja";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F2EDE6]">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <main className="p-8">
                <h1 className="text-2xl font-bold text-[#2A1F14]">
                  Bem-vindo ao Panelinhas!
                </h1>
                <p className="text-[#6B5040]">
                  A rua das lojas locais começa aqui.
                </p>
              </main>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/loja/:id" element={<Loja />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
