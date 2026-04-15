from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
        """Sirf owner ya admin access kar sakta hai"""
        def has_object_permissions(self,request,view,obj):
            return obj.user==request.user or request.user.is_Staff
#Aapne ek Invoice banayi. Dusra user usay edit nahi kar sakta kyunke obj.user (invoice banane wala) aap ho. Haan, agar koi Django Admin (is_staff) hai, toh wo sab ki invoices dekh sakta hai.       

class IsTenantMember(BasePermission):
    """Sirf tenenat ke members access kar sakte hain"""
    def has_permission(self, request, view):
         return hasattr(request.user,'tenant') and request.user.tenant is not None
#IsTenantMember permission ka matlab hai ke sirf wo log access kar sakte hain jo tenant ha

class IsOwner(BasePermission):
    """Sirf Owner access kr skta ha"""
    def has_permission(self, request, view):
         return request.user.role=='owner'

class IsAccountantOrOwner(BasePermission):
    """Sirf Acountant ya Owner access kr skta ha"""
    def has_permission(self, request, view):
         return request.user.role in ['accountant','owner']