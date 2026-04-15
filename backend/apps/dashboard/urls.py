from .views import DashboardView
from django.urls import path,include

urlpatterns=[
    path('',DashboardView.as_view())
]