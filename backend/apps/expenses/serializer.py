from .models import Expense,ExpenseCategory
from rest_framework import serializers


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ExpenseCategory
        fields=['id','name']




class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields="__all__"
        read_only_fields=['id','tenant','created_at','updated_at']#ye fields read only hain kyunki ye automatically generate hote hain, isliye user ko in fields ko manually set karne ki zarurat nahi hai
        