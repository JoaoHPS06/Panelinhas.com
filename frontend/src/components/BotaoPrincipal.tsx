// 1. Criamos o "contrato" (Interface) para o Inspetor de Qualidade
// Isso diz: "Quem usar este botão DEVE passar uma propriedade chamada 'texto', e ela DEVE ser uma string (texto)".
interface BotaoProps {
  texto: string; 
  onClick?: () => void;
  ativo?: boolean
}

export const BotaoPrincipal = ({ texto, onClick, ativo }: BotaoProps) => {
  return (
    <button 
      onClick={onClick}
      // 1. Abrimos { } para avisar o React que vamos rodar código JS.
      // 2. Usamos as crases ( ` ) para montar o texto dinâmico.
      // 3. O que está fora do ${} é aplicado sempre. O que está dentro depende da lógica!
      className={`px-4 py-2 rounded-md font-bold transition-transform hover:scale-105 ${
        ativo 
          ? 'bg-vermelho-pimenta text-white shadow-md' 
          : 'bg-transparent text-marrom-rustico hover:bg-vermelho-pimenta/10'
      }`}
    >
      {texto}
    </button>
  );
};