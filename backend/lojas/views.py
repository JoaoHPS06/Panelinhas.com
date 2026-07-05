from django.shortcuts import render

from rest_framework import viewsets
from .models import Loja
from .serializers import LojaSerializer


class LojaViewSet(viewsets.ModelViewSet):
    serializer_class = LojaSerializer

    def get_queryset(self):
        queryset = Loja.objects.all().order_by('-created_at')
        user_id = self.request.query_params.get('userId')
        loja_id = self.request.query_params.get('id')

        if user_id:
            queryset = queryset.filter(userId=user_id)
        if loja_id:
            queryset = queryset.filter(id=loja_id)

        return queryset