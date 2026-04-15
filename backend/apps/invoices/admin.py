from django.contrib import admin
from .models import Invoice, InvoiceItem

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1
    # Items ka total khud baki calculation mein help karega
    fields = ('description', 'quantity', 'unit_price', 'total_price')
    # readonly_fields = ('total_price',)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    # 1. Dashboard Columns
    # Agar 'invoice_number' error de raha hai, check karein model mein 'number' toh nahi?
    list_display = ('id', 'client', 'status', 'due_date') # Filhal basic fields rakh kar check karein    
    # 2. Filters
    list_filter = ('status', 'tenant', 'created_at')
    
    # 3. Search
    # client__name tab kaam karega agar Client model mein 'name' field hai
    search_fields = ('invoice_number', 'client__name', 'client__email')
    
    # 4. Inlines (Items ko invoice ke andar hi add karne ke liye)
    inlines = [InvoiceItemInline]
    
    # 5. Date Navigation
    date_hierarchy = 'created_at'

    # 6. Action for Quick Status Change
    actions = ['mark_as_paid']

    @admin.action(description='Mark selected invoices as Paid')
    def mark_as_paid(self, request, queryset):
        queryset.update(status='paid') # Check karein model mein 'paid' choice hai