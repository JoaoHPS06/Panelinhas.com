import { BotaoPrincipal } from "../components/BotaoPrincipal"
import { useNavigate } from "react-router-dom"
export const MinhasLojas = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <button
                onClick={() => {
                    navigate("/")
                }}
                className="bg-vermelho-pimenta text-white font-bold px-4 py-2 rounded-md hover:scale-105 transition-transform mb-4"
            >
                Voltar
            </button>
            <h1 className="text-2xl font-bold text-[#2A1F14] mb-4">Minhas Lojas</h1>
            <BotaoPrincipal
                texto="Cadastrar Nova Loja"
                onClick={() => {
                    navigate("/cadastro-loja")
                }}
            />
        </div>
    )
}