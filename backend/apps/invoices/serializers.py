from rest_framework import serializers
from .models import Invoice, InvoiceItem
from decimal import Decimal, InvalidOperation

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'amount']
        read_only_fields = ['amount']

    def to_internal_value(self, data):
        # Frontend se aane wale empty strings ko 0 mein convert karna
        for field in ['quantity', 'unit_price']:
            if data.get(field) == "" or data.get(field) is None:
                data[field] = '0'
        return super().to_internal_value(data)


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['id', 'tenant', 'invoice_number', 'subtotal', 'tax_amount', 'total', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # 1. Invoice create karein
        invoice = Invoice.objects.create(**validated_data)
        
        # 2. Har item ko safely handle karein
        for item in items_data:
            try:
                # Quantities aur prices ko Decimal mein convert karein
                qty = Decimal(str(item.get('quantity', 0)))
                price = Decimal(str(item.get('unit_price', 0)))
                item_amount = qty * price

                InvoiceItem.objects.create(
                    invoice=invoice,
                    description=item.get('description', ''),
                    quantity=qty,
                    unit_price=price,
                    amount=item_amount
                )
            except (InvalidOperation, TypeError):
                # Agar koi conversion fail ho toh default values use karein
                InvoiceItem.objects.create(
                    invoice=invoice,
                    description=item.get('description', ''),
                    quantity=Decimal('0'),
                    unit_price=Decimal('0'),
                    amount=Decimal('0')
                )
        
        # 3. Invoice ke totals update karein
        invoice.calculate_totals()
        return invoice