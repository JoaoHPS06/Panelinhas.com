from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UsuarioCustomizado

class UsuarioCustomizadoAdmin(UserAdmin):
    # Adicionar os campos personalizados na tela de edição do Admin
    fieldsets = UserAdmin.fieldsets + (
        ('Informações do Panelinhas', {'fields': ('eh_dono_loja', 'telefone')}),
    )
    
    # Quais colunas aparecem na lista de usuários
    list_display = ('email', 'username', 'first_name', 'eh_dono_loja')

admin.site.register(UsuarioCustomizado, UsuarioCustomizadoAdmin)