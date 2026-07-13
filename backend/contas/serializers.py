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


class PerfilSerializer(serializers.ModelSerializer):
    # Expõe first_name como "nome" pro front, mantendo o padrão que já usamos
    nome = serializers.CharField(source="first_name")

    class Meta:
        model = UsuarioCustomizado
        fields = ["id", "nome", "email", "telefone"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        # Garante e-mail único, mas ignora o próprio usuário na checagem
        usuario_atual = self.instance
        if UsuarioCustomizado.objects.exclude(pk=usuario_atual.pk).filter(email=value).exists():
            raise serializers.ValidationError("Já existe uma conta com este email.")
        return value


class AlterarSenhaSerializer(serializers.Serializer):
    senha_atual = serializers.CharField(write_only=True)
    nova_senha = serializers.CharField(write_only=True)
    confirmar_nova_senha = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["nova_senha"] != data["confirmar_nova_senha"]:
            raise serializers.ValidationError(
                {"confirmar_nova_senha": "As senhas não coincidem."}
            )
        if len(data["nova_senha"]) < 8:
            raise serializers.ValidationError(
                {"nova_senha": "A nova senha deve ter pelo menos 8 caracteres."}
            )
        return data