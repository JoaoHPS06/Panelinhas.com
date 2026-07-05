import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LojaHeader } from "../components/LojaHeader.tsx";
import { LojaProdutos, type Produto } from "../components/LojaProdutos.tsx";
import { LojaAvaliacoes, type Avaliacao } from "../components/LojaAvaliacoes.tsx";
import { LojaPosts, type PostLoja } from "../components/LojaPosts.tsx";
import { LojaComunidade, type TopicoForum } from "../components/LojaComunidade.tsx";
import { type LojaData } from "../components/PredioLoja.tsx";
import { ModalContato } from "../components/ModalContato.tsx";

type LojaCompleta = LojaData & {
  telefone: string;
  endereco: string;
  produtos: Produto[];
  avaliacoes: Avaliacao[];
  posts: PostLoja[];
  topicos: TopicoForum[];
};

// TODO: Criar produtos
const EXTRAS_PADRAO = {
  telefone: "",
  endereco: "",
  produtos: [] as Produto[],
  avaliacoes: [] as Avaliacao[],
  posts: [] as PostLoja[],
  topicos: [] as TopicoForum[],
};

export const Loja = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState<string>("catalogo");
  const [isModalAberto, setIsModalAberto] = useState<boolean>(false);

  const [lojaAtual, setLojaAtual] = useState<LojaCompleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarLoja = async () => {
      setLoading(true);
      setErro("");

      try {
        const res = await fetch(`http://localhost:8000/api/lojas/${id}/`);

        if (res.status === 404) {
          setLojaAtual(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Não foi possível carregar essa loja.");
        }

        const data: LojaData = await res.json();
        setLojaAtual({ ...data, ...EXTRAS_PADRAO });
      } catch (err: any) {
        console.error("Erro ao buscar loja:", err);
        setErro(err.message || "Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    if (id) buscarLoja();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-areia/20 p-4 text-center">
        <p className="text-cafe-expresso/60 text-sm">Carregando loja...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-areia/20 p-4 text-center">
        <span className="text-6xl mb-4">⚠️</span>
        <h1 className="text-2xl font-black text-marrom-rustico">Erro ao carregar</h1>
        <p className="text-cafe-expresso/60 text-sm mt-1">{erro}</p>
      </div>
    );
  }

  if (!lojaAtual) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-areia/20 p-4 text-center">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-2xl font-black text-marrom-rustico">Estabelecimento não encontrado</h1>
        <p className="text-cafe-expresso/60 text-sm mt-1">O link que você acessou pode estar quebrado ou a loja não existe.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-white to-areia/10 pb-20">
      <LojaHeader
        loja={lojaAtual}
        aba={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        onContatoClick={() => setIsModalAberto(true)}
        onVoltar={() => navigate(-1)}
      />

      <main className="container mx-auto">
        {abaAtiva === "catalogo" && (
          <LojaProdutos produtos={lojaAtual.produtos} />
        )}

        {abaAtiva === "avaliacoes" && (
          <LojaAvaliacoes avaliacoes={lojaAtual.avaliacoes} />
        )}

        {abaAtiva === "posts" && (
          <LojaPosts posts={lojaAtual.posts} />
        )}

        {abaAtiva === "comunidade" && (
          <LojaComunidade topicos={lojaAtual.topicos} />
        )}
      </main>

      <ModalContato
        isOpen={isModalAberto}
        onClose={() => setIsModalAberto(false)}
        loja={lojaAtual}
      />
    </div>
  );
};