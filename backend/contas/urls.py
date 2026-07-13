from django.urls import path
from .views import RegisterView, LoginView, PerfilView, AlterarSenhaView, DeletarContaView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("perfil/", PerfilView.as_view()),
    path("perfil/senha/", AlterarSenhaView.as_view()),
    path("perfil/deletar/", DeletarContaView.as_view()),
]