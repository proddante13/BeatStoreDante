from django.urls import path
from . import views

urlpatterns = [
    path('',views.home, name='home'),
    path('Base',views.base,  name='base'),
    path('Licencias',views.licencias, name='licencias'),
    path('Carrito',views.carrito, name='carrito')   
]