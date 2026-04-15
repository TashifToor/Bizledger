from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    # 1. Dashboard par nazar aane wali fields
    # Note: 'company' aapke model mein field hai, isliye yahan add ki hai
    list_display = ('name', 'email', 'tenant', 'company', 'created_at')
    
    # 2. Side bar filters
    # Client ko uski Company (Tenant) ke hisab se filter karna bohat zaroori hai
    list_filter = ('tenant', 'company', 'created_at')
    
    # 3. Search bar
    search_fields = ('name', 'email', 'company')
    
    # 4. Data entry form mein layout set karna (Optional but Clean)
    fieldsets = (
        ('Basic Information', {
            'fields': ('tenant', 'name', 'email', 'phone')
        }),
        ('Company Details', {
            'fields': ('company', 'address', 'notes')
        }),
    )

    # 5. Default ordering (Wese model ki Meta class mein bhi hai, par yahan bhi de sakte hain)
    ordering = ('-created_at',)