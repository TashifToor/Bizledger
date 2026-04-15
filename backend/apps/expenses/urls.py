from .views import ExpenseView,ExpenseCategoryView
from django.urls import path,include
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register("categories",ExpenseCategoryView,basename='expense-category')
router.register("",ExpenseView,basename='expense')

urlpatterns=[
    path("",include(router.urls))
]