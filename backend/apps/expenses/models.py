from django.db import models
from core.models import BaseModel
# Create your models here.

class ExpenseCategory(BaseModel):
    tenant=models.ForeignKey("tenants.Tenant",on_delete=models.CASCADE,related_name="expense_categories")
    name=models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Expense(BaseModel):
    class PaymentMethod(models.TextChoices):
        CASH='cash','Cash',
        CREDIT_CARD='credit_card','Credit Card',
        JAZZCASH = 'jazzcash', 'JazzCash'
        EASYPAISA = 'easypaisa', 'EasyPaisa'
        OTHER='other','Other'
        
    tenant=models.ForeignKey("tenants.Tenant",on_delete=models.CASCADE,related_name="expense")
    category=models.ForeignKey(ExpenseCategory,on_delete=models.SET_NULL,null=True,blank=True,related_name='expenses')
    title=models.CharField(max_length=255)
    amount=models.DecimalField(max_digits=12,decimal_places=2)
    payment_method=models.CharField(max_length=20,choices=PaymentMethod.choices,default=PaymentMethod.CASH)
    date=models.DateField()
    receipt=models.FileField(upload_to="expense_receipt",null=True,blank=True)
    notes=models.TextField(blank=True)
    
    class Meta:
        # 'order' ko hata kar '-created_at' ya '-date' kar dein
        ordering = ["-created_at"]#latest expense will be on top
    
    def __str__(self):
        return f"{self.title}-{self.amount}"#jab ye call hota hai to expense ka title aur amount show hoga, for example: "Office Supplies - 150.00"
