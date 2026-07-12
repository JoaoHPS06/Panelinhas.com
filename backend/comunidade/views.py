from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from .models import Post, Avaliacao, Pergunta
from .serializers import PostSerializer, AvaliacaoSerializer, PerguntaSerializer
from django.shortcuts import get_object_or_404
from lojas.models import Loja 

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        loja_id = self.request.data.get('loja')
        # Garante que a loja existe e pertence ao usuário
        loja = get_object_or_404(Loja, id=loja_id, dono=self.request.user)
        serializer.save(loja=loja)

    def get_queryset(self):
        """Permite que o React filtre os posts usando ?loja=ID na URL"""
        queryset = super().get_queryset()
        loja_id = self.request.query_params.get('loja')
        if loja_id:
            queryset = queryset.filter(loja_id=loja_id).order_by('-criado_em')
        return queryset


class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # A nova forma de verificar se o usuário é dono de alguma loja
        if self.request.user.minhas_lojas.exists():
            raise PermissionDenied("Donos de loja não podem avaliar estabelecimentos.")
        serializer.save(usuario=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        loja_id = self.request.query_params.get('loja')
        if loja_id:
            queryset = queryset.filter(loja_id=loja_id)
        return queryset


class PerguntaViewSet(viewsets.ModelViewSet):
    queryset = Pergunta.objects.all()
    serializer_class = PerguntaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.minhas_lojas.exists():
            raise PermissionDenied("Donos de loja não podem fazer perguntas.")
        serializer.save(autor=self.request.user)

    def perform_update(self, serializer):
        pergunta = self.get_object()
        # Verifica se o dono daquela loja específica é o usuário logado
        if pergunta.loja.dono != self.request.user:
            raise PermissionDenied("Acesso negado. Você só pode responder perguntas da sua própria loja.")
        serializer.save(respondido_em=timezone.now())
    
    def get_queryset(self):
        """Permite que o React filtre as perguntas usando ?loja=ID na URL"""
        queryset = super().get_queryset()
        loja_id = self.request.query_params.get('loja')
        if loja_id:
            queryset = queryset.filter(loja_id=loja_id).order_by('-criado_em')
        return queryset