from .models import Tenant
from rest_framework import serializers

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model=Tenant
        fields="__all__"
        read_only_fields=['id','created_at','updated_at']
        
        