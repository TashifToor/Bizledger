from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from django.utils import timezone
from apps.invoices.models import Invoice
from apps.expenses.models import Expense
from apps.clients.models import Client


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        tenant = request.user.tenant

        # ✅ Tenant nahi hai toh empty data return karo
        if not tenant:
            return Response({
                'monthly_revenue': 0,
                'monthly_expenses': 0,
                'net_profit': 0,
                'pending_invoices_count': 0,
                'pending_invoices_total': 0,
                'total_clients': 0,
                'recent_invoices': [],
                'recent_expenses': [],
            })

        now = timezone.now()

        monthly_revenue = Invoice.objects.filter(
            tenant=tenant,
            status=Invoice.Status.PAID,
            issue_date__month=now.month,
            issue_date__year=now.year
        ).aggregate(total=Sum('total'))['total'] or 0

        monthly_expenses = Expense.objects.filter(
            tenant=tenant,
            date__month=now.month,
            date__year=now.year
        ).aggregate(total=Sum('amount'))['total'] or 0

        pending = Invoice.objects.filter(
            tenant=tenant,
            status__in=[Invoice.Status.SENT, Invoice.Status.OVERDUE]
        ).aggregate(count=Count('id'), total=Sum('total'))

        total_clients = Client.objects.filter(
            tenant=tenant,
            is_active=True
        ).count()

        recent_invoices = Invoice.objects.filter(
            tenant=tenant
        ).values(
            'id', 'invoice_number',
            'client__name', 'total',
            'status', 'due_date'
        ).order_by('-created_at')[:5]

        recent_expenses = Expense.objects.filter(
            tenant=tenant
        ).values(
            'id', 'title',
            'amount', 'date',
            'category__name'
        ).order_by('-date')[:5]

        return Response({
            'monthly_revenue': monthly_revenue,
            'monthly_expenses': monthly_expenses,
            'net_profit': monthly_revenue - monthly_expenses,
            'pending_invoices_count': pending['count'] or 0,
            'pending_invoices_total': pending['total'] or 0,
            'total_clients': total_clients,
            'recent_invoices': list(recent_invoices),
            'recent_expenses': list(recent_expenses),
        })