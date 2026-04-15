from webbrowser import get

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.db.models import Sum,Count
from apps.invoices.models import Invoice
from apps.expenses.models import Expense
from django.utils import timezone

from core.permissions import IsAccountantOrOwner

# Create your views here.

class FinancialReportView(APIView):
    permission_classes=[permissions.IsAuthenticated,IsAccountantOrOwner]
    
    def get(self,request):
        tenant=request.user.tenant#logged in user ke tenant ko variable ma store kar lo
        month=int(request.query_params.get('month',timezone.now().month))#agar url ma month pass kiya hai to usko use karo, warna current month ka data dikhao
        year=int(request.query_params.get('year',timezone.now().year))#agar url ma year pass kiya hai to usko use karo, warna current year ka data dikhao
        
        invoice=Invoice.objects.filter(
            tenant=tenant,
            status=Invoice.Status.PAID,
            issue_date__month=month,
            issue_date__year=year
        )
        expense=Expense.objects.filter(
            tenant=tenant,
            date__month=month,
            date__year=year
        )
        #The Math (aggregate): Ye SQL ki power use karta hai. Poore table ki rows ko jama karke ek single number nikalta hai.
        total_revenue=invoice.aggregate(total_sum=Sum('total'))['total'] or 0#agar total sum null hai to 0 return karo
        total_expense=expense.aggregate(total_sum=Sum('amount'))['total'] or 0#agar total sum null hai to 0 return karo
        
        return Response({
            'month': month,#ye month aur year ke hisab se report generate kar rahe hain
            'year': year,#ye month aur year ke hisab se report generate kar rahe hain
            'total_revenue': total_revenue,
            'total_expense': total_expense,
            'profit': total_revenue - total_expense,
            'invoice_count': invoice.count(),#is month me total kitni invoices paid hui hain
            'expense_count': expense.count()#is month me total kitni expenses paid hui hain
        })
        

class InvoiceStatusReportView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def get(self,request):
        tenant=request.user.tenant
        data=Invoice.objects.filter(tenant=tenant).values('status').annotate(
            count=Count('id'),
            total_amount=Sum('total')
        )
        return Response(list(data))
    #values('status'): Ye database ko kehta hai ke invoices ko "Status" ke mutabiq groups mein baant do.

#annotate(count=Count('id')): Ye har group ke andar baith kar ginta hai ke "Paid" wali kitni hain aur "Pending" wali kitni.

#Result: Ye aapko ek list dega jaise: [{'status': 'PAID', 'count': 5}, {'status': 'PENDING', 'count': 2}].
class ExpenseCategoryReport(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def get(self,request):
        tenant=request.user.tenant
        month=int(request.query_params.get("month",timezone.now().month))
        year=int(request.query_params.get("year",timezone.now().year))
        
        data=Expense.objects.filter(
            tenant=tenant,
            date__month=month,
            date__year=year
        ).values('category__name').annotate(#Ye "Double Underscore" (__) ka matlab hai ke Expense table se jump maaro Category table mein aur wahan se uska Name uthao.
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')#ye line se sabse zyada expense wali category pehle aayegi
        
        return Response(list(data)) 
    