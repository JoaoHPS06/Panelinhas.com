from rest_framework import serializers
from .models import Post, Avaliacao, Pergunta

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        # O backend descobre a loja automaticamente baseado em quem está logado
        read_only_fields = ['criado_em']


class AvaliacaoSerializer(serializers.ModelSerializer):
    # Pega o 'username' do usuário e manda para o React como 'nome_usuario'
    nome_usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Avaliacao
        fields = ['id', 'loja', 'usuario', 'nome_usuario', 'nota', 'comentario', 'criado_em']
        read_only_fields = ['usuario', 'criado_em']


class PerguntaSerializer(serializers.ModelSerializer):
    nome_autor = serializers.ReadOnlyField(source='autor.username')

    class Meta:
        model = Pergunta
        fields = '__all__'
        read_only_fields = ['autor', 'respondido_em', 'criado_em']