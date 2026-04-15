from django.shortcuts import render
from rest_framework import generics, permissions

from core.permissions import IsOwner
from .models import Tenant
from .serializer import TenantSerializer


# Create your views here.

class TenantViews(generics.RetrieveUpdateAPIView):
    serializer_class=TenantSerializer
    permission_classes=[permissions.IsAuthenticated, IsOwner]
    
    def get_object(self):#Security ke liye hai taake logged-in user sirf apne Tenant ka data dekh sakay, kisi aur ka nahi
        return self.request.user.tenant