import { useParams } from "react-router-dom";
import { BotaoPrincipal } from "../components/BotaoPrincipal";
import { useState } from "react";

interface PostProps {
  texto: string;
  autor: string;
}

const PostComunidade = ({ texto, autor }: PostProps) => {
  return (
    <article className="relative pl-20 pr-4 mb-12 flex items-center min-h-12">
      <div className="flex items-center justify-center text-white font-bold absolute left-2 w-12 h-12 rounded-full bg-verde-salvia"></div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-marrom-rustico">{autor}</span>
          <p className="text-cafe-expresso leading-relaxed">{texto}</p>
        </div>

    </article>
  );
};

export const Loja = () => {
  // O hook useParams serve para pegar o "id" que veio lá da URL
  const { id } = useParams<{ id: string }>();
  const [abaAtiva, setAbaAtiva] = useState("catalogo");

  const lista = [
  { id: 1, nome: "Pão Francês", preco: 1.00, imagem: "https://picsum.photos/200?random=1" },
  { id: 2, nome: "Bolo", preco: 15.00, imagem: "https://picsum.photos/200?random=2" },
  { id: 3, nome: "Pingado", preco: 3.00, imagem: "https://picsum.photos/200?random=3" },
  { id: 4, nome: "Mussarela", preco: 12.00, imagem: "https://picsum.photos/200?random=4" }
  ];

  return (
    <div className="min-h-screen bg-creme-suave">
      <img
        src="https://picsum.photos/1200/400"
        alt="Foto ilustrativa"
        className="w-full h-[40vh] object-cover mask-image-[linear-gradient(to_bottom,rgba(0,0,0,1)_50%,rgba(0,0,0,0)_100%)]"
      />
      
      <div className="max-w-7xl mx-auto w-full px-8 py-8 flex justify-between items-end">
        <div className="flex items-center gap-8">
          <img
            src="https://picsum.photos/200"
            alt="Foto de Perfil"
            className="w-32 h-32 rounded-full border-4 border-creme-suave shadow-lg z-10 -mt-16"
          />
          <div className="">
            <h1 className="text-5xl font-bold text-marrom-rustico">Padaria do Seu Zé</h1>
            <p className="text-cafe-expresso">Alimentação • 4.8 Estrelas</p>
          </div>

        </div>
        <BotaoPrincipal texto="+ Seguir" />
      </div>
      
      <nav className="sticky top-20 z-40 bg-creme-suave/80 backdrop-blur-md py-4 border-b border-marrom-rustico/10">
        <div className="flex gap-8">
          <BotaoPrincipal texto="Catálogo" onClick={() => setAbaAtiva("catalogo")} ativo={abaAtiva === "catalogo"} />
          <BotaoPrincipal texto="Ofertas" onClick={() => setAbaAtiva("ofertas")} ativo={abaAtiva === "ofertas"} />
          <BotaoPrincipal texto="Comunidade" onClick={() => setAbaAtiva("comunidade")} ativo={abaAtiva === "comunidade"} />

        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {abaAtiva==="catalogo" && (<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lista.map((item) => (
            <div key={item.id} className="flex flex-col justify-between h-full gap-4 border border-marrom-rustico/10 p-6 rounded-xl">
              <img 
                src={item.imagem} 
                alt={item.nome} 
                className="w-full h-32 object-cover rounded-md" 
              />
              
              <div className="flex flex-col gap-1 mt-auto">
                <h1 className="text-verde-salvia font-bold">{item.nome}</h1>
                <p className="text-cafe-expresso">R$ {item.preco}</p>
              </div>

            </div>
          ))}
        
        </div>
        )}

        {abaAtiva==="comunidade" && (<div className="w-full max-w-2xl mx-auto flex flex-col py-12 relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-marrom-rustico/80 to-transparent" />
          <PostComunidade texto="Hoje fui na padaria e comprei um pão quentinho!" autor="Anônimo" />
          <PostComunidade texto="Hoje fui na padaria e comprei um pão quentinho!" autor="Anônimo2" />
        </div>
        )}
      </div>
      
    </div>
  );
};
