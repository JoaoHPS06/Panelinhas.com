from rest_framework.routers import DefaultRouter
from .views import LojaViewSet

router = DefaultRouter()
router.register(r'lojas', LojaViewSet, basename='loja')

urlpatterns = router.urls