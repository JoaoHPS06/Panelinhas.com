from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LojaViewSet, ProdutoViewSet

# O Router cria as rotas de GET, POST, PUT, DELETE automaticamente
router = DefaultRouter()
router.register(r'lojas', LojaViewSet)
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]