from rest_framework import serializers
from .models import UsuarioCustomizado

class RegisterSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(write_only=True)
    senha = serializers.CharField(write_only=True)
    confirmarSenha = serializers.CharField(write_only=True)

    class Meta:
        model = UsuarioCustomizado
        fields = [
            "nome",
            "email",
            "senha",
            "confirmarSenha",
        ]

    def validate_email(self, value):
        if UsuarioCustomizado.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Já existe uma conta com este email."
            )
        return value

    def validate(self, data):
        if data["senha"] != data["confirmarSenha"]:
            raise serializers.ValidationError(
                {"confirmarSenha": "As senhas não coincidem."}
            )
        return data

    def create(self, validated_data):
        nome = validated_data.pop("nome")
        senha = validated_data.pop("senha")
        validated_data.pop("confirmarSenha")

        usuario = UsuarioCustomizado(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=nome,
        )

        usuario.set_password(senha)
        usuario.save()

        return usuario