from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    #auth
    path("api/auth/", include("apps.accounts.urls")),
    #Apps
    path("api/tenants/",include("apps.tenants.urls")),
    path("api/clients/",include("apps.clients.urls")),
    path("api/invoices/",include("apps.invoices.urls")),#Jo /api/invoices pe awayega, wo apps.invoices.urls me jayega, aur waha se uske aage ke endpoints handle honge.
    path("api/expenses/",include("apps.expenses.urls")),#/API Is se clear ho jata hai ke ye backend API endpoints hain, na ke frontend ke pages.
    path("api/reports/",include("apps.reports.urls")),
    path("api/dashboard/",include("apps.dashboard.urls")),
    
]
if settings.DEBUG:#jab tak hum development mode me hain, tab tak media files serve karne ke liye ye code chahiye, production me ye code nahi chahiye, kyunki production me media files ko serve karne ke liye alag se setup karna padta hai (e.g., AWS S3, Cloudinary, etc.)
    urlpatterns +=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
    