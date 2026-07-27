from rest_framework import serializers
from .models import Loja, Produto

class ProdutoSerializer(serializers.ModelSerializer):
    usuario_favoritou = serializers.SerializerMethodField()
    total_favoritos = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = [
        'id', 'loja', 'nome', 'descricao', 'preco', 'emoji', 'criado_em',
        'usuario_favoritou', 'total_favoritos'
        ]
        read_only_fields = ['loja'] 

    def get_usuario_favoritou(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favoritado_por.filter(id=request.user.id).exists()
        return False
    
    def get_total_favoritos(self, obj):
        return obj.favoritado_por.count()

class LojaSerializer(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True)
    usuario_segue = serializers.SerializerMethodField()
    total_seguidores = serializers.SerializerMethodField()
    nota_media = serializers.SerializerMethodField()

    class Meta:
        model = Loja
        fields = [
            'id', 'dono', 'nome', 'categoria', 'descricao', 'criado_em', 'produtos', 
            'usuario_segue', 'total_seguidores', 'emoji', 'cor_primaria', 'cor_secundaria', 
            'telefone', 'endereco', 'esta_aberta', 'janelas', 'nota_media'
        ]
        read_only_fields = ['dono', 'criado_em']

    # Função que verifica se o usuário que fez a requisição segue a loja
    def get_usuario_segue(self, obj):
        request = self.context.get('request')
        # Se tiver alguém logado, verifica se ele está na lista de seguidores
        if request and request.user.is_authenticated:
            return obj.seguidores.filter(id=request.user.id).exists()
        return False

    # Função que conta o total real de seguidores no banco
    def get_total_seguidores(self, obj):
        return obj.seguidores.count()

    def get_nota_media(self, obj):
        # Busca todas as avaliações ligadas a esta loja (Ajuste 'avaliacao_set' se necessário)
        avaliacoes = obj.avaliacoes.all()
        if avaliacoes.exists():
            media = sum(av.nota for av in avaliacoes) / avaliacoes.count()
            return round(media, 1) # Arredonda para 1 casa decimal (ex: 4.8)
        return 5.0 # Nota padrão se não houver avaliações