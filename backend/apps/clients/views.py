from django.shortcuts import render
from rest_framework import viewsets,permissions,filters

from core.permissions import IsAccountantOrOwner
from .models import Client
from .serializers import ClientSerializer


# Create your views here.


class ClientView(viewsets.ModelViewSet):
    serializer_class=ClientSerializer
    permission_classes=[permissions.IsAuthenticated, IsAccountantOrOwner]
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_filter=['name','email','phone']#client ke name, email, phone se search kar sakte hain
    ordering_fields=['created_at','name']#created_at aur name ke hisab se order kar sakte hain
    
    def get_queryset(self):
        return Client.objects.filter(
            tenant=self.request.user.tenant,
#Ye sab se zaroori hai. Iska matlab hai ke agar "Tashif" login hai, toh usay sirf uski apni company ke clients dikhao, kisi aur ke nahi.
            is_active=True
        )
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
#Jab bhi koi naya client create hoga, toh ye method automatically us client ke tenant field mein logged-in user ke tenant ko set kar dega. Is se aapko har baar client create karte waqt tenant specify karne ki zaroorat nahi padegi, aur galti se bhi koi client galat tenant ke under create nahi ho payega.