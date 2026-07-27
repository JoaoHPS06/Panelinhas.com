from rest_framework import serializers
from .models import Post, PostReacao, Avaliacao, Pergunta

class PostSerializer(serializers.ModelSerializer):
    total_likes = serializers.SerializerMethodField()
    total_dislikes = serializers.SerializerMethodField()
    reacao_usuario = serializers.SerializerMethodField()  # 'like', 'dislike' ou None

    class Meta:
        model = Post
        fields = '__all__'
        # O backend descobre a loja automaticamente baseado em quem está logado
        read_only_fields = ['criado_em']

    def get_total_likes(self, obj):
        return obj.reacoes.filter(tipo=PostReacao.LIKE).count()

    def get_total_dislikes(self, obj):
        return obj.reacoes.filter(tipo=PostReacao.DISLIKE).count()

    def get_reacao_usuario(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reacao = obj.reacoes.filter(usuario=request.user).first()
            return reacao.tipo if reacao else None
        return None



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