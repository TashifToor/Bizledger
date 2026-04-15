from django.shortcuts import render
from rest_framework import generics,permissions
from rest_framework_simplejwt.views import TokenObtainPairView 
from django.contrib.auth import get_user_model
from core.permissions import IsOwnerOrAdmin

from .serializers import RegisterSerializers,CustomTokenSerializers,UserSerializers

User=get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegisterSerializers
    permission_classes=[permissions.AllowAny]
#CreateAPIView: Ye sirf POST request accept karta hai.
#AllowAny: Ye bohot zaroori hai. Kyunke naya banda jo sign-up kar raha hai, uske paas abhi koi Token nahi hoga. Agar yahan IsAuthenticated hota, toh koi bhi kabhi register hi na kar pata!
    
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializers
    permission_classes=[permissions.AllowAny]
#Aapne pichle message mein CustomTokenSerializers mein email aur role add kiya tha.
#Jab user apna email/password bhejega, toh ye view usay Access aur Refresh tokens wapas karega, jin ke andar wo custom data (claims) maujood hoga jo aapne serializer mein set kiya tha
    
class MeView(generics.RetrieveUpdateAPIView):
    serializer_class=UserSerializers
    permission_classes=[permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user   
    
# Create your views here.
