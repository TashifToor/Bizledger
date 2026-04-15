from django.db import models
from core.models import BaseModel
# Create your models here.

class Client(BaseModel):
    tenant=models.ForeignKey("tenants.Tenant",on_delete=models.CASCADE,related_name="clients")
    name=models.CharField(max_length=50)
    email=models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    address=models.TextField(blank=True)
    company=models.CharField(max_length=13,default='USD')
    notes=models.TextField(blank=True)
    
    
    class Meta:
        ordering=["-created_at"]#latest client will be on top
        unique_together=['tenant','email']#each tenant can have unique email but different tenants can have same email
    
    def __str__(self):
        return f"{self.name}-{self.email}"#jab ye call hota hai to client ka name aur email show hoga, for example: "John" john@mail.com
    
