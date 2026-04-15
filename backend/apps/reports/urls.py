from .views import FinancialReportView,InvoiceStatusReportView,ExpenseCategoryReport
from django.urls import path,include

urlpatterns=[
    path("financial/",FinancialReportView.as_view()),
    path("invoice-status/",InvoiceStatusReportView.as_view()),
    path("expense-category/",ExpenseCategoryReport.as_view())
]