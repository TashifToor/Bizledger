from django.contrib import admin
from .models import Expense, ExpenseCategory

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'created_at')
    list_filter = ('tenant',)
    # search_fields ko tuple banane ke liye comma (,) lagana zaroori hai
    search_fields = ('name',) 

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    # Sirf wo fields jo Expense model mein hain
    list_display = ('title', 'amount', 'category', 'payment_method', 'date', 'tenant')
    
    # Side filters (Tenant aur Category ke hisab se filter karna SaaS mein zaroori hai)
    list_filter = ('tenant', 'category', 'payment_method', 'date')
    
    # Search bar
    search_fields = ('title', 'notes')
    
    # Date hierarchy (Upar calendar view ban jayega)
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('tenant', 'category', 'title', 'amount')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'date', 'receipt', 'notes')
        }),
    )