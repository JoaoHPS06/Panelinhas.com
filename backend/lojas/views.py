from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action 
from rest_framework.response import Response 
from .models import Loja, Produto
from .serializers import LojaSerializer, ProdutoSerializer

class LojaViewSet(viewsets.ModelViewSet):
    queryset = Loja.objects.all()
    serializer_class = LojaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'minha_loja'):
            raise ValidationError({"detail": "Você já possui uma loja cadastrada."})
        serializer.save(dono=self.request.user)

    # 👈 NOVA FUNÇÃO AQUI: Cria a rota POST /api/lojas/<id>/seguir/
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def seguir(self, request, pk=None):
        loja = self.get_object() # Pega a loja pelo ID da URL
        usuario = request.user   # Descobre quem é o usuário pelo Token JWT

        # Se o usuário já segue, a gente remove (Deixar de seguir)
        if usuario in loja.seguidores.all():
            loja.seguidores.remove(usuario)
            return Response({"status": "deixou_de_seguir", "seguidores_totais": loja.seguidores.count()})
        
        # Se não segue, a gente adiciona (Seguir)
        else:
            loja.seguidores.add(usuario)
            return Response({"status": "seguindo", "seguidores_totais": loja.seguidores.count()})

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