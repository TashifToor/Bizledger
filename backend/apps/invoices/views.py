from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice
from .serializers import InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'client__name', 'status']
    ordering_fields = ['created_at', 'due_date', 'total']

    def get_queryset(self):
        qs = Invoice.objects.filter(
            tenant=self.request.user.tenant
        ).prefetch_related('items')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        tenant = self.request.user.tenant
        last = Invoice.objects.filter(tenant=tenant).count() + 1
        invoice_number = f"INV-{str(last).zfill(3)}"
        serializer.save(tenant=tenant, invoice_number=invoice_number)

    def create(self, request, *args, **kwargs):
        print('Invoice data received:', request.data)  # ← add karo
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print('Validation errors:', serializer.errors)  # ← add karo
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)