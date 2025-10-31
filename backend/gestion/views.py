from django.shortcuts import render
from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Servicio, Cliente, Cita
from .serializers import ServicioSerializer, ClienteSerializer, CitaSerializer


class ServicioViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Servicio.objects.filter(activo=True).order_by('nombre')
    serializer_class = ServicioSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class CitaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    # 🔑 MÉTODO SOBREESCRITO: Maneja la creación de la cita y el envío de email
    def create(self, request, *args, **kwargs):
        # 1. Ejecutar la validación y creación estándar de DRF
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Después de la creación exitosa, se obtiene la instancia de la cita guardada
        cita_instance = serializer.instance 
        
        # --- Lógica de Notificación por Email ---
        try:
            # Recuperar el objeto Cliente de la cita guardada para obtener el email
            cliente = Cliente.objects.get(pk=cita_instance.cliente_id)
            
            asunto = 'Confirmación de Cita - [Nombre del Estudio]'
            
            # Contenido para tu amiga (Control)
            cuerpo_amiga = (
                f'¡NUEVA CITA RESERVADA! \n\n'
                f'Cliente: {cliente.nombre} {cliente.apellido}\n'
                f'Servicio: {cita_instance.servicio.nombre}\n'
                f'Fecha: {cita_instance.fecha} a las {cita_instance.hora_inicio}.'
            )
            
            # Contenido para el cliente
            cuerpo_cliente = (
                f'Hola {cliente.nombre}, tu cita ha sido confirmada.\n\n'
                f'Servicio: {cita_instance.servicio.nombre}\n'
                f'Fecha: {cita_instance.fecha} a las {cita_instance.hora_inicio}.\n\n'
                f'¡Te esperamos!'
            )
            
            # 1. Notificar a tu amiga (Correo de control)
            send_mail(
                asunto, 
                cuerpo_amiga, 
                'reservas@tudominio.com', # EMAIL_HOST_USER configurado
                ['email_de_tu_amiga@ejemplo.com'], # Correo de destino de control
                fail_silently=False
            )
            
            # 2. Notificar al cliente
            send_mail(
                asunto, 
                cuerpo_cliente, 
                'reservas@tudominio.com', 
                [cliente.email], # Correo del cliente que reservó
                fail_silently=False
            )

        except Exception as e:
            # Si el email falla, al menos la cita se guarda en la base de datos
            print(f"ERROR AL ENVIAR EMAIL: {e}")
            # Considerar registrar el error de email en un log

        # Devolver la respuesta 201 Created al Front-End
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)