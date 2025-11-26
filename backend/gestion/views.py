from datetime import datetime, timedelta, time
from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta, time
from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser

from .models import Servicio, Cliente, Cita, BloqueoHorario, ConfiguracionHorario
from .serializers import ServicioSerializer, ClienteSerializer, CitaSerializer, ConfiguracionHorarioSerializer


class ServicioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Servicio.objects.filter(activo=True).order_by('nombre')
    serializer_class = ServicioSerializer

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def disponibilidad(self, request, pk=None):
        """
        Retorna los horarios disponibles para un servicio en una fecha específica.
        Uso: /api/servicios/{id}/disponibilidad/?fecha=YYYY-MM-DD
        """
        servicio = self.get_object()
        fecha_str = request.query_params.get('fecha')

        if not fecha_str:
            return Response({'error': 'Parámetro fecha requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Verificar si la fecha es pasada
        if fecha < timezone.now().date():
            return Response({'horarios': []}, status=status.HTTP_200_OK)

        # 2. Verificar bloqueos completos (feriados, vacaciones, etc.)
        if BloqueoHorario.objects.filter(fecha=fecha).exists():
             return Response({'horarios': []}, status=status.HTTP_200_OK)

        # 3. Verificar Configuración de Días Laborales
        dia_semana = fecha.weekday() # 0=Lunes, 6=Domingo
        try:
            config_dia = ConfiguracionHorario.objects.get(dia_semana=dia_semana)
            if not config_dia.activo:
                return Response({'horarios': [], 'razon': 'Día no laboral'}, status=status.HTTP_200_OK)
            
            HORA_APERTURA = config_dia.hora_apertura
            HORA_CIERRE = config_dia.hora_cierre
        except ConfiguracionHorario.DoesNotExist:
            # Si no hay configuración, asumimos horario default o cerrado
            # Por defecto asumimos cerrado para obligar a configurar
            return Response({'horarios': [], 'razon': 'Día no configurado'}, status=status.HTTP_200_OK)

        
        # 4. Obtener citas existentes
        citas = Cita.objects.filter(fecha=fecha).exclude(estado='A')

        # 5. Generar slots
        duracion = servicio.duracion_minutos
        slots_disponibles = []
        
        current_dt = datetime.combine(fecha, HORA_APERTURA)
        cierre_dt = datetime.combine(fecha, HORA_CIERRE)

        if fecha == timezone.now().date():
            now = timezone.now()
            if now.time() > HORA_APERTURA:
                 while current_dt < now:
                     current_dt += timedelta(minutes=30)

        while current_dt + timedelta(minutes=duracion) <= cierre_dt:
            inicio_slot = current_dt
            fin_slot = current_dt + timedelta(minutes=duracion)
            
            conflicto = False
            for cita in citas:
                cita_inicio = datetime.combine(fecha, cita.hora_inicio)
                cita_fin = cita_inicio + timedelta(minutes=cita.servicio.duracion_minutos)
                
                if inicio_slot < cita_fin and fin_slot > cita_inicio:
                    conflicto = True
                    break
            
            if not conflicto:
                slots_disponibles.append(inicio_slot.strftime('%H:%M'))
            
            current_dt += timedelta(minutes=30)

        return Response({'horarios': slots_disponibles})


class ConfiguracionHorarioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint público para obtener los días y horarios de atención.
    """
    permission_classes = [AllowAny]
    queryset = ConfiguracionHorario.objects.filter(activo=True)
    serializer_class = ConfiguracionHorarioSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        cita_instance = serializer.instance 
        
        try:
            cliente = Cliente.objects.get(pk=cita_instance.cliente_id)
            asunto = 'Confirmación de Cita - [Nombre del Estudio]'
            
            cuerpo_amiga = (
                f'¡NUEVA CITA RESERVADA! \n\n'
                f'Cliente: {cliente.nombre} {cliente.apellido}\n'
                f'Servicio: {cita_instance.servicio.nombre}\n'
                f'Fecha: {cita_instance.fecha} a las {cita_instance.hora_inicio}.'
            )
            
            cuerpo_cliente = (
                f'Hola {cliente.nombre}, tu cita ha sido confirmada.\n\n'
                f'Servicio: {cita_instance.servicio.nombre}\n'
                f'Fecha: {cita_instance.fecha} a las {cita_instance.hora_inicio}.\n\n'
                f'¡Te esperamos!'
            )
            
            send_mail(
                asunto, 
                cuerpo_amiga, 
                settings.SERVER_EMAIL,
                [settings.SERVER_EMAIL],
                fail_silently=False
            )
            
            send_mail(
                asunto, 
                cuerpo_cliente, 
                settings.SERVER_EMAIL, 
                [cliente.email],
                fail_silently=False
            )

        except Exception as e:
            print(f"ERROR AL ENVIAR EMAIL: {e}")

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)