from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from .models import Loja, Produto
from .serializers import LojaSerializer, ProdutoSerializer

class LojaViewSet(viewsets.ModelViewSet):
    queryset = Loja.objects.all()
    serializer_class = LojaSerializer
    # Qualquer um pode ver (visitantes), mas só logados podem criar/editar
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Interceptamos a criação para vincular o usuário automaticamente
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'minha_loja'):
            raise ValidationError({"detail": "Você já possui uma loja cadastrada."})
        serializer.save(dono=self.request.user)

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Garante que o usuário tem uma loja antes de cadastrar o produto
        if not hasattr(self.request.user, 'minha_loja'):
            raise ValidationError({"detail": "Você precisa cadastrar uma loja primeiro."})
        
        # O produto é vinculado automaticamente à loja do usuário logado
        serializer.save(loja=self.request.user.minha_loja)