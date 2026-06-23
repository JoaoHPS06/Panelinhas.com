interface PredioLojaProps {
  imagem: string;
  nome: string;
  posicao: string; // Ex: "top-[20%] left-[30%]"
}

export const PredioLoja = ({ imagem, nome, posicao }: PredioLojaProps) => {
  return (
    <div className={`absolute ${posicao} w-42 h-42 origin-bottom group cursor-pointer transition-transform hover:-translate-y-4`}>
      <img 
        src={imagem} 
        alt={nome} 
        className="image-pixelated w-full h-full object-contain scale-250"
      />
      {/* Label que só aparece no hover */}
      <div className="absolute -top-10 left-0 bg-creme-suave/90 px-3 py-1 rounded-full text-cafe-expresso font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        {nome}
      </div>
    </div>
  );
};