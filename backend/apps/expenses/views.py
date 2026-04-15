from django.shortcuts import render
from rest_framework import viewsets,permissions,filters

from core.permissions import IsAccountantOrOwner
from .models import Expense,ExpenseCategory
from .serializer import ExpenseSerializer,ExpenseCategorySerializer
# Create your views here.

class ExpenseCategoryView(viewsets.ModelViewSet):
    serializer_class=ExpenseCategorySerializer
    permission_classes=[permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ExpenseCategory.objects.filter(
            tenant=self.request.user.tenant#agar tashif login to usay sirf uski company ke expense dikhao
        )
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)#hab bi koyi naya expense category ma add ho to uska tenant field ma logged in user ke tenant ko set kar do, taake galti se bhi koi category galat tenant ke under create na ho jaye
        
        
class ExpenseView(viewsets.ModelViewSet):
    serializer_class=ExpenseSerializer
    permission_classes=[permissions.IsAuthenticated, IsAccountantOrOwner]
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['title','category__name','status']#category ke name se bhi search kar sakte hain
    ordering_fields=['category','amount']#category aur amount ke hisab se order kar sakte hain
    
    def get_queryset(self):
        qs= Expense.objects.filter(tenant=self.request.user.tenant)#agar tashif login to usay sirf uski company ke expense dikhao
        category=self.request.query_params.get('category')#is se matlab jo url ma category id pass karenge usko filter kar ke dikhayega
        if category:
            qs=qs.filter(category=category)
        return qs
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)