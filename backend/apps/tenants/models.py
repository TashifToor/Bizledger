from django.db import models
from core.models import BaseModel
# Create your models here.

class Tenant(BaseModel):
    name=models.CharField(max_length=100)
    slug=models.SlugField(unique=True)
    email=models.EmailField(unique=True)
    phone=models.IntegerField(blank=False,null=True)
    address=models.TextField(blank=True)
    logo=models.ImageField(upload_to='tenant_logos/',null=True,blank=True)
    currency=models.CharField(max_length=13,default='USD')
    tax_number=models.CharField(max_length=50,blank=True)
    
    def __str__(self):
        return self.name

