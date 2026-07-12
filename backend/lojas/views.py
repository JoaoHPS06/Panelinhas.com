from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action 
from rest_framework.response import Response 
from .models import Loja, Produto
from .serializers import LojaSerializer, ProdutoSerializer
from django.shortcuts import get_object_or_404

class LojaViewSet(viewsets.ModelViewSet):
    queryset = Loja.objects.all()
    serializer_class = LojaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(dono=self.request.user)

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
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def minhas_lojas(self, request):
        """
        Retorna apenas as lojas onde o usuário logado é o DONO.
        """
        lojas = self.queryset.filter(dono=request.user)
        serializer = self.get_serializer(lojas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def seguidas(self, request):
        """
        Retorna apenas as lojas que o usuário logado SEGUE.
        """
        lojas = self.queryset.filter(seguidores=request.user)
        serializer = self.get_serializer(lojas, many=True)
        return Response(serializer.data)

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # 1. Pega o ID da loja que o React enviou no JSON
        loja_id = self.request.data.get('loja')
        
        if not loja_id:
            raise ValidationError({"detail": "O ID da loja é obrigatório para cadastrar o produto."})
            
        # 2. Busca a loja no banco. Se a loja não for desse usuário, ele dá erro 404 automaticamente
        loja = get_object_or_404(Loja, id=loja_id, dono=self.request.user)
        
        # 3. Salva o produto vinculando a essa loja exata
        serializer.save(loja=loja)