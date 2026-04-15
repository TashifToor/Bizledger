from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):#django ka built in user model ko extend krne ke liye AbstractUser ka use krte hain
    class Role(models.TextChoices):#dropdown ke liye choices define
        OWNER = 'owner','OWNER',
        ACCOUNTANT = 'accountant','ACCOUNTANT',
        VIEWER='viewer','VIEWER',
        
    email=models.EmailField(unique=True)
    #email field ko unique banaya taki duplicate email na ho
    # YE DO LINES ADD KAREIN:
    USERNAME_FIELD = 'email'  # Ab login username ki jagah email se hoga
    REQUIRED_FIELDS = ['username'] # Email ke ilawa register ke waqt kya zaroori hai
    role=models.CharField(max_length=50,choices=Role.choices,default=Role.OWNER)#role field ko charfield banaya aur usme choices di taki user sirf defined roles me se select kar sake, default role owner hai
    tenant=models.ForeignKey('tenants.Tenant',on_delete=models.SET_NULL,null=True,blank=True,related_name='members')
    #models.ForeignKey ka matlab hai ke ye field tenants app ke Tenant model se judi hui (linked) hai.
    #'tenants.Tenant': Yeh batata hai ke is field ka connection tenants naam ki app ke Tenant model ke sath hai
    #on_delete=models.SET_NULL:"Agar wo 'Tenant' (Company) delete ho jaye, toh uske andar wale Users ko delete mat karna, bas unki tenant wali jagah ko khaali (NULL) kar dena.SaaS Logic: Agar koi company apna account band karti hai, toh aap shayad unka data (Users) foran delete na karna chahein audit purposes ke liye.
    #Agar aapke paas ek Tenant object hai (e.g., my_tenant), toh aap my_tenant.members.all() likh kar us company ke saare users ko ek second mein nikaal sakte hain.
    #nill = true se matlab ke feild khali reh skti database ma or blank=true se matlab form empty submit kr skta hai
    avatar=models.ImageField(upload_to='avatars/',null=True,blank=True)#avatar field ko imagefield banaya taki user apna profile picture upload kar sake, upload_to='avatars/' ka matlab hai ki uploaded images avatars folder me store hongi, null=True aur blank=True ka matlab hai ki ye field optional hai
    
    
        

# Create your models here.
