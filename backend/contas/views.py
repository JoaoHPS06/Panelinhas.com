from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, PerfilSerializer, AlterarSenhaSerializer
from rest_framework_simplejwt.tokens import RefreshToken 

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Conta criada com sucesso."},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        senha = request.data.get('senha')
        
        if not email or not senha:
            return Response(
                {"detail": "Email e senha são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = authenticate(request, username=email, password=senha)
        
        if usuario is not None:
            # GERA OS TOKENS DE SEGURANÇA (JWT) PARA ESSE USUÁRIO
            refresh = RefreshToken.for_user(usuario)
            
            return Response({
                "id": usuario.id,
                "email": usuario.email,
                "nome": getattr(usuario, 'first_name', ''),
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "detail": "Login realizado com sucesso!"
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Email ou senha inválidos."},
                status=status.HTTP_401_UNAUTHORIZED
            )


class PerfilView(APIView):
    """GET retorna os dados do usuário logado; PATCH edita nome/email/telefone."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = PerfilSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = PerfilSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AlterarSenhaView(APIView):
    """Troca a senha do usuário logado, exigindo a senha atual por segurança."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AlterarSenhaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        usuario = request.user
        senha_atual = serializer.validated_data["senha_atual"]
        nova_senha = serializer.validated_data["nova_senha"]

        if not usuario.check_password(senha_atual):
            return Response(
                {"detail": "Senha atual incorreta."},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario.set_password(nova_senha)
        usuario.save()
        return Response({"detail": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)


class DeletarContaView(APIView):
    """Apaga permanentemente a conta do usuário logado, exigindo a senha por segurança."""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        senha = request.data.get("senha")
        if not senha or not request.user.check_password(senha):
            return Response(
                {"detail": "Senha incorreta."},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.delete()
        return Response(
            {"detail": "Conta deletada com sucesso."},
            status=status.HTTP_200_OK
        )