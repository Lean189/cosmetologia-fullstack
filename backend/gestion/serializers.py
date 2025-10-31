from rest_framework import serializers
from .models import Servicio, Cliente, Cita ,BloqueoHorario
from django.core.exceptions import ValidationError


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
        """Verifica si la fecha de la cita está marcada como bloqueada."""
        # Intenta encontrar la fecha en el modelo de bloqueo
        # Nota: Asume que el modelo BloqueoHorario existe y está migrado.
        if BloqueoHorario.objects.filter(fecha=value).exists():
            # Si existe, lanza un error de validación que Django REST Framework capturará
            raise serializers.ValidationError("La fecha seleccionada ha sido marcada como no disponible por el gabinete.")
        return value