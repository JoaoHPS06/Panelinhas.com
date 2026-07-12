from rest_framework import serializers
from .models import Loja, Produto

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'
        read_only_fields = ['loja'] 

class LojaSerializer(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True)
    
    # NOVOS CAMPOS DINÂMICOS:
    usuario_segue = serializers.SerializerMethodField()
    total_seguidores = serializers.SerializerMethodField()

    class Meta:
        model = Loja
        fields = ['id', 'dono', 'nome', 'categoria', 'descricao', 'criado_em', 'produtos', 'usuario_segue', 'total_seguidores']
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