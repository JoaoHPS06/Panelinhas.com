from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, AvaliacaoViewSet, PerguntaViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet)
router.register(r'perguntas', PerguntaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]