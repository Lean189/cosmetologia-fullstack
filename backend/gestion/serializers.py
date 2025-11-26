from rest_framework import serializers
from .models import Servicio, Cliente, Cita, BloqueoHorario, ConfiguracionHorario
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'descripcion', 'precio', 'duracion_minutos', 'activo']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'apellido', 'email', 'telefono']


class CitaSerializer(serializers.ModelSerializer):
    # Campos de ESCRITURA (manejan el ID del POST)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())
    servicio = serializers.PrimaryKeyRelatedField(queryset=Servicio.objects.all())
    
    # Campos de SÓLO LECTURA (DRF los usa para el GET, no para el POST)
    cliente_nombre_completo = serializers.ReadOnlyField(source='cliente.__str__')
    servicio_nombre = serializers.ReadOnlyField(source='servicio.nombre')
    
    class Meta:
        model = Cita
        fields = [
            'id', 
            'cliente',
            'servicio', 
            'cliente_nombre_completo', 
            'servicio_nombre', 
            'fecha', 
            'hora_inicio', 
            'estado',
            'notas',
        ]
        
        read_only_fields = ['estado', 'cliente_nombre_completo', 'servicio_nombre']
        
    def validate_fecha(self, value):
        """Verifica si la fecha de la cita es válida."""
        # 1. Validar fechas pasadas
        if value < timezone.now().date():
            raise serializers.ValidationError("No se pueden reservar citas en fechas pasadas.")

        # 2. Validar bloqueos
        if BloqueoHorario.objects.filter(fecha=value).exists():
            raise serializers.ValidationError("La fecha seleccionada ha sido marcada como no disponible por el gabinete.")
        return value

    def validate(self, data):
        """Validación cruzada para solapamiento de horarios."""
        fecha = data.get('fecha')
        hora_inicio = data.get('hora_inicio')
        servicio = data.get('servicio')

        if fecha and hora_inicio and servicio:
            # Calcular hora fin de la nueva cita
            duracion = servicio.duracion_minutos
            # Convertir hora_inicio a datetime para sumar minutos
            inicio_dt = datetime.combine(fecha, hora_inicio)
            fin_dt = inicio_dt + timedelta(minutes=duracion)
            hora_fin = fin_dt.time()

            # Buscar citas existentes en esa fecha
            citas_dia = Cita.objects.filter(fecha=fecha).exclude(estado='A') # Excluir canceladas
            
            for cita in citas_dia:
                # Calcular rango de la cita existente
                cita_inicio = datetime.combine(fecha, cita.hora_inicio)
                cita_fin = cita_inicio + timedelta(minutes=cita.servicio.duracion_minutos)
                
                # Verificar solapamiento:
                # (StartA < EndB) and (EndA > StartB)
                if inicio_dt < cita_fin and fin_dt > cita_inicio:
                    raise serializers.ValidationError(
                        f"El horario seleccionado se superpone con otra cita (de {cita.hora_inicio} a {cita_fin.time()})."
                    )
        
        return data

class ConfiguracionHorarioSerializer(serializers.ModelSerializer):
    dia_nombre = serializers.CharField(source='get_dia_semana_display', read_only=True)
    
    class Meta:
        model = ConfiguracionHorario
        fields = ['id', 'dia_semana', 'dia_nombre', 'activo', 'hora_apertura', 'hora_cierre']