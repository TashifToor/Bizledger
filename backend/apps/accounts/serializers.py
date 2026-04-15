from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User=get_user_model() #in setting we define AUTH_USER_MODEL = 'accounts.User'

from apps.tenants.models import Tenant
from django.utils.text import slugify
import uuid

class RegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role']

    def create(self, validated_data):
        role = validated_data.pop('role', 'owner')

        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
        )
        user.role = role

        # ✅ Register pe automatically tenant banta hai
        slug = slugify(validated_data['username']) + '-' + str(uuid.uuid4())[:8]
        tenant = Tenant.objects.create(
            name=validated_data['username'] + "'s Business",
            slug=slug,
            email=validated_data['email'],
        )
        user.tenant = tenant
        user.save()
        return user

#write_only=True: Iska matlab hai ke password sirf Registration ke waqt bheja jayega. Jab API wapas user ka data dikhayegi, toh usmein password nahi hoga. Ye security ke liye lazmi hai.

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','email','username','role','tenant','avatar']

class CustomTokenSerializers(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        # gettoken ko get_token karein
        token = super().get_token(user) 
        token['email'] = user.email
        token['role'] = user.role
        token['tenant_id'] = str(user.tenant_id) if user.tenant_id else None
        return token
    #Iska maqsad ye hai ke jab user login kare, toh uske Access Token ke andar hi uska email aur role chupa ho. Taake React ko baar baar profile API call na karni paray