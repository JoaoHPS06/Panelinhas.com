from django.db import models
from django.conf import settings

class Loja(models.Model):

    dono = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, # se o usuário for deletado, a loja também será.
        related_name='minha_loja'
    )
    seguidores = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='lojas_seguidas', 
        blank=True
    )
    nome = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50)
    descricao = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome


class Produto(models.Model):
    # O ForeignKey (1 para N) indica que uma Loja pode ter VÁRIOS produtos.
    # O related_name='produtos' 
    loja = models.ForeignKey(
        Loja, 
        on_delete=models.CASCADE, 
        related_name='produtos' # permite buscar todos os produtos de uma loja facilmente depois.
    )
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    
    # DecimalField é a única forma segura de trabalhar com dinheiro em bancos de dados
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.loja.nome})"