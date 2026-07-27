from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Post, PostReacao, Avaliacao, Pergunta
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

    def perform_update(self, serializer):
        post = self.get_object()
        # Só o dono da loja daquele post pode editá-lo
        if post.loja.dono != self.request.user:
            raise PermissionDenied("Acesso negado. Você só pode editar posts da sua própria loja.")
        serializer.save()

    def perform_destroy(self, instance):
        # Só o dono da loja daquele post pode excluí-lo
        if instance.loja.dono != self.request.user:
            raise PermissionDenied("Acesso negado. Você só pode excluir posts da sua própria loja.")
        instance.delete()

    def get_queryset(self):
        """Permite que o React filtre os posts usando ?loja=ID na URL"""
        queryset = super().get_queryset()
        loja_id = self.request.query_params.get('loja')
        if loja_id:
            queryset = queryset.filter(loja_id=loja_id).order_by('-criado_em')
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reagir(self, request, pk=None):
        post = self.get_object()
        usuario = request.user
        tipo = request.data.get('tipo')  # 'like' ou 'dislike'

        if tipo not in [PostReacao.LIKE, PostReacao.DISLIKE]:
            return Response(
                {"detail": "O campo 'tipo' deve ser 'like' ou 'dislike'."},
                status=400
            )

        reacao_existente = PostReacao.objects.filter(post=post, usuario=usuario).first()

        if reacao_existente:
            if reacao_existente.tipo == tipo:
                # Clicou de novo no mesmo botão → remove a reação (toggle off)
                reacao_existente.delete()
                reacao_atual = None
            else:
                # Estava como like e clicou em dislike (ou vice-versa) → troca
                reacao_existente.tipo = tipo
                reacao_existente.save()
                reacao_atual = tipo
        else:
            PostReacao.objects.create(post=post, usuario=usuario, tipo=tipo)
            reacao_atual = tipo

        return Response({
            'reacao_usuario': reacao_atual,
            'total_likes': post.reacoes.filter(tipo=PostReacao.LIKE).count(),
            'total_dislikes': post.reacoes.filter(tipo=PostReacao.DISLIKE).count(),
        })


class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # A nova forma de verificar se o usuário é dono de alguma loja
        if self.request.user.minhas_lojas.exists():
            raise PermissionDenied("Donos de loja não podem avaliar estabelecimentos.")
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        avaliacao = self.get_object()
        # Só quem escreveu a avaliação pode editá-la
        if avaliacao.usuario != self.request.user:
            raise PermissionDenied("Acesso negado. Você só pode editar sua própria avaliação.")
        serializer.save()

    def perform_destroy(self, instance):
        # Só quem escreveu a avaliação pode excluí-la
        if instance.usuario != self.request.user:
            raise PermissionDenied("Acesso negado. Você só pode excluir sua própria avaliação.")
        instance.delete()

    def get_queryset(self):
        queryset = super().get_queryset()
        loja_id = self.request.query_params.get('loja')
        if loja_id:
            queryset = queryset.filter(loja_id=loja_id)
        return queryset
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def responder(self, request, pk=None):
        avaliacao = self.get_object()

        # Só o dono da loja avaliada pode responder
        if avaliacao.loja.dono != request.user:
            raise PermissionDenied("Acesso negado. Apenas o dono da loja pode responder a esta avaliação.")

        resposta = request.data.get('resposta_dono', '').strip()
        if not resposta:
            return Response({"detail": "O campo 'resposta_dono' é obrigatório."}, status=400)

        avaliacao.resposta_dono = resposta
        avaliacao.respondido_em = timezone.now()
        avaliacao.save()

        serializer = self.get_serializer(avaliacao)
        return Response(serializer.data)


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

    def perform_destroy(self, instance):
        # Só o dono da loja pode excluir perguntas feitas a ela
        if instance.loja.dono != self.request.user:
            raise PermissionDenied("Acesso negado. Você só pode excluir perguntas da sua própria loja.")
        instance.delete()
    
    def get_queryset(self):
        """Permite que o React filtre as perguntas usando ?loja=ID na URL"""
        queryset = super().get_queryset()
        loja_id = self.request.query_params.get('loja')
        if loja_id:
            queryset = queryset.filter(loja_id=loja_id).order_by('-criado_em')
        return queryset