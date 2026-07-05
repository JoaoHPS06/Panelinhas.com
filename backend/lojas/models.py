from django.db import models


class Loja(models.Model):
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=60)
    emoji = models.CharField(max_length=10)
    description = models.TextField(blank=True)
    primary = models.CharField(max_length=7)   
    secondary = models.CharField(max_length=7)
    userId = models.CharField(max_length=120, null=True, blank=True)
    rating = models.FloatField(default=5.0)
    followers = models.IntegerField(default=0)
    isOpen = models.BooleanField(default=True)
    windows = models.JSONField(default=list) 

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name