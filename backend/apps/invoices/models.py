from django.db import models
from core.models import BaseModel
from decimal import Decimal, ROUND_HALF_UP

class Invoice(BaseModel):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        SENT = 'sent', 'Sent'
        PAID = 'paid', 'Paid'
        OVERDUE = 'overdue', 'Overdue'
        CANCELLED = 'cancelled', 'Cancelled'

    # Relationships
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='invoices')
    client = models.ForeignKey('clients.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    
    # Main Fields
    invoice_number = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    issue_date = models.DateField()
    due_date = models.DateField()
    notes = models.TextField(blank=True)
    
    # Financial Fields (Precision Fixed)
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=17, decimal_places=2, default=0)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ['tenant', 'invoice_number']

    def calculate_totals(self):
        """
        Calculates subtotal, tax, and final total based on related InvoiceItems.
        Uses quantize to avoid Decimal InvalidOperation errors.
        """
        # 1. Sum up all items
        self.subtotal = sum(item.amount for item in self.items.all()) or Decimal('0.00')
        
        # 2. Calculate Tax
        tax_rate = Decimal(str(self.tax_percent)) / Decimal('100')
        self.tax_amount = (self.subtotal * tax_rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        # 3. Final Total
        self.total = (self.subtotal + self.tax_amount - Decimal(str(self.discount))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        # 4. Save the calculated values
        # Note: We use update_fields to avoid re-triggering the full save logic
        super().save(update_fields=['subtotal', 'tax_amount', 'total'])

    def save(self, *args, **kwargs):
        # Auto-generate Invoice Number for each Tenant
        if not self.invoice_number:
            last_invoice = Invoice.objects.filter(tenant=self.tenant).order_by('-id').first()
            if last_invoice and last_invoice.invoice_number:
                try:
                    # Example: 'INV-001' -> 1 + 1 = 2 -> 'INV-002'
                    parts = last_invoice.invoice_number.split('-')
                    number_part = int(parts[-1])
                    self.invoice_number = f"INV-{str(number_part + 1).zfill(3)}"
                except (ValueError, IndexError):
                    self.invoice_number = "INV-001"
            else:
                self.invoice_number = "INV-001"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.client}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=12, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=17, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        # Always calculate amount before saving
        qty = Decimal(str(self.quantity or 1))
        price = Decimal(str(self.unit_price or 0))
        self.amount = (qty * price).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} - {self.amount}"