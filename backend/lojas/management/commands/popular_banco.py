import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lojas.models import Loja, Produto
from django.utils import timezone

from lojas.models import Loja, Produto
from comunidade.models import Post, Avaliacao, Pergunta

User = get_user_model()

class Command(BaseCommand):
    help = 'Popula o banco de dados com lojas e produtos falsos para testes'

    def handle(self, *args, **kwargs):
        self.stdout.write("Gerando lojas e produtos mockados...")
        categorias = ['Cafeteria', 'Restaurante', 'Padaria', 'Roupas', 'Tecnologia']

        # Criação de clientes de teste
        clientes = []
        for i in range(1, 4):
            cliente, _ = User.objects.get_or_create(
                email=f"cliente{i}@teste.com",
                defaults={'username': f'cliente{i}'}
            )
            cliente.set_password('senha123')
            cliente.save()
            clientes.append(cliente)
        
        # Criação de donos de loja de teste
        for i in range(1, 6):
            email = f"dono{i}@teste.com"
            # Cria 5 usuários de teste
            dono, created = User.objects.get_or_create(
                email=email,
                defaults={'username': f'dono{i}'}
            )
            if created:
                dono.set_password('senha123')
                dono.save()

            # Cria a loja para o usuário
            loja, loja_created = Loja.objects.get_or_create(
                dono=dono,
                defaults={
                    'nome': f"Estabelecimento de Teste {i}",
                    'categoria': random.choice(categorias),
                    'descricao': "Descrição teste de loja do Panelinhas.com"
                }
            )

            # Cria 3 produtos para cada loja
            if loja_created:
                for j in range(1, 4):
                    Produto.objects.create(
                        loja=loja,
                        nome=f"Produto {j} da Loja {i}",
                        descricao=f"Produto teste para loja {i} da comunidade.",
                        preco=random.uniform(15.50, 250.00)
                    )

                # --- COMUNIDADE: POSTS ---
                Post.objects.create(
                    loja=loja,
                    titulo=f"Post da {loja.nome}!",
                    conteudo="Post da loja de teste do Panelinhas.com",
                )

                # --- COMUNIDADE: AVALIAÇÕES ---
                # Escolhe 2 clientes aleatórios da nossa lista para avaliar esta loja
                clientes_avaliacao = random.sample(clientes, 2)
                for cliente in clientes_avaliacao:
                    Avaliacao.objects.create(
                        loja=loja,
                        usuario=cliente,
                        nota=random.randint(1, 5), # Notas de avaliacao
                        comentario="Comentário de avaliação da loja de teste do Panelinhas.com"
                    )

                # --- COMUNIDADE: PERGUNTAS E RESPOSTAS ---
                # Uma pergunta JÁ RESPONDIDA pelo dono
                cliente_pergunta_1 = random.choice(clientes)
                Pergunta.objects.create(
                    loja=loja,
                    autor=cliente_pergunta_1,
                    texto_pergunta="Pergunta genérica feita ao dono da loja(?)",
                    texto_resposta="Resposta genérica feita pelo dono da loja",
                    respondido_em=timezone.now() # Data de resposta da pergunta
                )
                
                # Uma pergunta PENDENTE 
                cliente_pergunta_2 = random.choice([c for c in clientes if c != cliente_pergunta_1]) # Escolhe um cliente aleatório que não foi a primeira pergunta
                Pergunta.objects.create(
                    loja=loja,
                    autor=cliente_pergunta_2,
                    texto_pergunta="Pergunta genérica feita ao dono da loja que ainda não foi respondida(?)"
                )
        
        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso com dados da comunidade"))
        self.stdout.write("\n--- DADOS DE ACESSO PARA TESTES NO FRONTEND ---")
        self.stdout.write(" Para testar como DONO DA LOJA (pode criar post e responder perguntas):")
        self.stdout.write("    Login: dono1@teste.com | Senha: senha123")
        self.stdout.write("\n Para testar como CLIENTE COMUM (pode avaliar e fazer perguntas):")
        self.stdout.write("    Login: cliente1@teste.com | Senha: senha123\n")