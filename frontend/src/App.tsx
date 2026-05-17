import { Navbar } from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-[#F2EDE6]">
      <Navbar />
      
      <main className="p-8">
        <h1 className="text-2xl font-bold text-[#2A1F14]">
          Bem-vindo ao Panelinhas!
        </h1>
        <p className="text-[#6B5040]">A rua das lojas locais começa aqui.</p>
      </main>
    </div>
  );
}

export default App;