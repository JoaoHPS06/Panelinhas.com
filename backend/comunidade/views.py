from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from .models import Post, Avaliacao, Pergunta
from .serializers import PostSerializer, AvaliacaoSerializer, PerguntaSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Bloqueia quem não tem loja de criar post
        if not hasattr(self.request.user, 'minha_loja'):
            raise PermissionDenied("Apenas donos de estabelecimentos podem criar posts.")

        # Salva a loja que criou o post no JSON
        serializer.save(loja=self.request.user.minha_loja)


class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Bloqueia quem tem loja de criar avaliações
        if hasattr(self.request.user, 'minha_loja'):
            raise PermissionDenied("Donos de loja não podem avaliar estabelecimentos.")
        
        # Salva o usuário que criou a avaliação no JSON
        serializer.save(usuario=self.request.user)

    def get_queryset(self):
        """Permite que o React filtre os dados usando ?loja=ID na URL"""
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
        if hasattr(self.request.user, 'minha_loja'):
        # Bloqueia quem tem loja de criar perguntas
            raise PermissionDenied("Donos de loja não podem fazer perguntas.")
        serializer.save(autor=self.request.user)

    def perform_update(self, serializer):
        pergunta = self.get_object()
        
        # Apenas o dono daquela loja pode responder
        # Verifica se o usuário tem loja e se a loja é a mesma da pergunta
        if not hasattr(self.request.user, 'minha_loja') or self.request.user.minha_loja != pergunta.loja:
            raise PermissionDenied("Acesso negado. Você só pode responder perguntas da sua própria loja.")
        
        # Salva a data de resposta automaticamente no JSON
        serializer.save(respondido_em=timezone.now())