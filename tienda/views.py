from django.shortcuts import render
from .models import Beat



def home(request):
    beats = Beat.objects.all()
    return render(request, 'tienda/index.html',{'beats':beats})


def base(request):
    return render(request, 'tienda/base.html')

def licencias(request):
    return render(request, 'tienda/licencias.html')

def carrito(request):
    return render(request, 'tienda/carrito.html')

# def lista_pistas(request):
#     beat = Beat.objects.all()
#     return render(request, 'index.html',{'beats':beat})