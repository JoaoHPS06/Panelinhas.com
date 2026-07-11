import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lojas.models import Loja, Produto

User = get_user_model()

class Command(BaseCommand):
    help = 'Popula o banco de dados com lojas e produtos falsos para testes'

    def handle(self, *args, **kwargs):
        self.stdout.write("Gerando lojas e produtos mockados...")
        categorias = ['Cafeteria', 'Restaurante', 'Padaria', 'Roupas', 'Tecnologia']
        
        for i in range(1, 6):
            email = f"dono{i}@teste.com"
            # Cria 5 usuários de teste
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': f'dono{i}'}
            )
            if created:
                user.set_password('senha123')
                user.save()

            # Cria a loja para o usuário
            loja, loja_created = Loja.objects.get_or_create(
                dono=user,
                defaults={
                    'nome': f"Estabelecimento de Teste {i}",
                    'categoria': random.choice(categorias),
                    'descricao': "Uma loja incrível parceira do Panelinhas.com!"
                }
            )

            # Cria 3 produtos para cada loja
            if loja_created:
                for j in range(1, 4):
                    Produto.objects.create(
                        loja=loja,
                        nome=f"Produto {j} da Loja {i}",
                        descricao="Produto de excelente qualidade para a comunidade.",
                        preco=random.uniform(15.50, 250.00)
                    )
        
        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso! Você pode logar com 'dono1@teste.com' e senha 'senha123'"))