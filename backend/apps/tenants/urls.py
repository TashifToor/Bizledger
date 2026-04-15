from django.urls import path
from .views import TenantViews

urlpatterns=[
    path("me/",TenantViews.as_view()),
    ]