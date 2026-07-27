from django.db import models
from django.conf import settings
from lojas.models import Loja

class Post(models.Model):
    """Publicações de ofertas e novidades feitas pelo dono da loja"""
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, related_name='posts')
    titulo = models.CharField(max_length=200)
    conteudo = models.TextField()
    
    # Imagem do post
    imagem_url = models.URLField(blank=True, null=True, help_text="Link para a imagem do post")
    
    # Data de criação do post
    criado_em = models.DateTimeField(auto_now_add=True)

    # Retorna o título do post
    def __str__(self):
        return f"{self.titulo} ({self.loja.nome})"


class PostReacao(models.Model):
    """Like ou dislike de um usuário em um post. Um usuário só pode ter uma reação por post."""
    LIKE = 'like'
    DISLIKE = 'dislike'
    TIPO_CHOICES = [
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reacoes')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reacoes_posts')
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Garante que um usuário só tenha UMA reação (like OU dislike) por post
        unique_together = ('post', 'usuario')

    def __str__(self):
        return f"{self.usuario.username} {self.tipo} em '{self.post.titulo}'"


class Avaliacao(models.Model):
    """Avaliações de 1 a 5 estrelas deixadas por usuários cadastrados"""
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, related_name='avaliacoes')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='avaliacoes_feitas')
    
    # O choices faz com que o campo nota só possa ser preenchido com valores entre 1 e 5
    nota = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) 
    comentario = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    resposta_dono = models.TextField(blank=True, null=True)
    respondido_em = models.DateTimeField(blank=True, null=True)

    class Meta:
        # Garante que um usuário só possa avaliar a mesma loja uma única vez
        unique_together = ('loja', 'usuario')

    def __str__(self):
        return f"Nota {self.nota} de {self.usuario.username} para {self.loja.nome}"


class Pergunta(models.Model):
    """Sistema de Q&A entre comunidade e o dono da loja"""
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, related_name='perguntas')
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='perguntas_feitas')
    
    texto_pergunta = models.TextField()
    
    # A resposta começa vazia (blank=True, null=True) e será preenchida pelo dono da loja depois
    texto_resposta = models.TextField(blank=True, null=True)
    respondido_em = models.DateTimeField(blank=True, null=True)
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Respondida" if self.texto_resposta else "Pendente"
        return f"Pergunta de {self.autor.username} para {self.loja.nome} [{status}]"