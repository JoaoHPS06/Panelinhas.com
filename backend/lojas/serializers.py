from rest_framework import serializers
from .models import Loja, Produto

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'
        # o backend descobre o ID da loja
        read_only_fields = ['loja'] 

class LojaSerializer(serializers.ModelSerializer):
    # Trazemos os produtos da loja embutidos no JSON usando o related_name
    produtos = ProdutoSerializer(many=True, read_only=True)

    class Meta:
        model = Loja
        fields = ['id', 'dono', 'nome', 'categoria', 'descricao', 'criado_em', 'produtos']
        # O frontend não pode alterar o dono nem a data
        read_only_fields = ['dono', 'criado_em']