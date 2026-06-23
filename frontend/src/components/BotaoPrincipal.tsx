// 1. Criamos o "contrato" (Interface) para o Inspetor de Qualidade
// Isso diz: "Quem usar este botão DEVE passar uma propriedade chamada 'texto', e ela DEVE ser uma string (texto)".
interface BotaoProps {
  texto: string; 
  onClick?: () => void;
}

// 2. Colocamos as Props dentro dos parênteses da função, igual aos parâmetros de uma função em C.
// E avisamos que ela deve seguir o contrato ': BotaoProps'
export const BotaoPrincipal = ({ texto, onClick }: BotaoProps) => {
  
  return (
    <button onClick={onClick} className="bg-vermelho-pimenta text-white font-bold px-4 py-2 rounded-md hover:scale-105 transition-transform">
      {/* 3. Substituímos o "Comprar" fixo pela nossa variável. 
          No React, sempre que queremos usar uma variável dentro do HTML, colocamos ela entre chaves { } */}
      {texto}
    </button>
  );
};