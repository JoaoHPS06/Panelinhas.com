import { useParams } from "react-router-dom";

export const Loja = () => {
  // O hook useParams serve para pegar o "id" que veio lá da URL
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#2A1F14]">Detalhes da Loja</h1>
      <p className="text-[#6B5040] mt-2">
        Você está visualizando a loja com o ID:{" "}
        <span className="font-bold text-[#D85A30]">{id}</span>
      </p>
    </div>
  );
};
