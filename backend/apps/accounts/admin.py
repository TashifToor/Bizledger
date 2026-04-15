from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # 1. Dashboard par kaunsi fields nazar aayengi
    list_display = ('username', 'email', 'role', 'tenant', 'is_staff')
    
    # 2. Side par filters (Role aur Tenant ke hisab se filter karna asaan hoga)
    list_filter = ('role', 'tenant', 'is_staff', 'is_superuser')
    
    # 3. Search bar mein kya search kar sakte hain
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    # 4. User edit karte waqt fields ko groups mein dikhana
    # Hum 'Role' aur 'Tenant' ko 'Personal Info' wale section mein add kar rahe hain
    fieldsets = UserAdmin.fieldsets + (
        ('SaaS Details', {'fields': ('role', 'tenant', 'avatar')}),
    )
    
    # 5. Naya user banate waqt kaunsi fields nazar aayengi
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('SaaS Details', {'fields': ('role', 'tenant', 'email', 'avatar')}),
    )

    # 6. Default ordering
    ordering = ('username',)