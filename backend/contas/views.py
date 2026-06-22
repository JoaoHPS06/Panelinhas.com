# contas/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer

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
            return Response({
                "id": usuario.id,
                "email": usuario.email,
                "nome": usuario.first_name,
                "detail": "Login realizado com sucesso!"
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Email ou senha inválidos."},
                status=status.HTTP_401_UNAUTHORIZED
            )