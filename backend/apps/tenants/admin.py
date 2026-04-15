from django.contrib import admin
from .models import Tenant

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    # 1. Dashboard Columns
    list_display = ('name', 'email', 'currency', 'tax_number', 'created_at')
    
    # 2. Filters (Currency ya Date ke hisab se filter karna)
    list_filter = ('currency', 'created_at')
    
    # 3. Search
    search_fields = ('name', 'email', 'slug', 'tax_number')
    
    # 4. Slug Auto-populate (Jab aap name likhenge, slug khud bakhud ban jayega)
    prepopulated_fields = {'slug': ('name',)}
    
    # 5. Layout
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'email', 'phone')
        }),
        ('Business Details', {
            'fields': ('currency', 'tax_number', 'logo', 'address')
        }),
    )