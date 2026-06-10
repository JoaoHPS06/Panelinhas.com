from django.db import models
from django.contrib.auth.models import AbstractUser

class usuarioCustomizado(AbstractUser):
    # O AbstractUser já traz username, first_name, last_name, email e password.
    # Complementaremos com os campos email, eh_dono_loja e telefone.
    
    email = models.EmailField(unique=True) # Exigimos que o email seja único
    eh_dono_loja = models.BooleanField(
        default=False, 
        help_text="Marcar se este usuário é um estabelecimento comercial."
    )
    telefone = models.CharField(max_length=15, blank=True, null=True)

    # Usar o email como campo de login principal 
    USERNAME_FIELD = 'email'
    
    # Campos obrigatórios ao criar um superusuário no terminal
    REQUIRED_FIELDS = ['username', 'first_name']

    def __str__(self):
        return self.email