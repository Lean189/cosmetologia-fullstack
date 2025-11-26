from django.contrib import admin
from .models import Servicio, Cliente, Cita, BloqueoHorario, ConfiguracionHorario

# 1. Registra el modelo Servicio
@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    # Campos que se muestran en la lista de Servicios
    list_display = ('nombre', 'precio', 'duracion_minutos', 'activo')
    # Permite filtrar por estado
    list_filter = ('activo',)
    # Permite buscar por nombre
    search_fields = ('nombre',)

# 2. Registra el modelo Cliente
@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'email', 'telefono')
    search_fields = ('nombre', 'apellido', 'email')

# 3. Registra el modelo Cita
@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'servicio', 'fecha', 'hora_inicio', 'estado')
    list_filter = ('estado', 'servicio')
    search_fields = ('cliente__nombre', 'cliente__apellido')
    list_editable = ('estado',)

@admin.register(BloqueoHorario)
class BloqueoHorarioAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'razon')
    ordering = ('fecha',)

@admin.register(ConfiguracionHorario)
class ConfiguracionHorarioAdmin(admin.ModelAdmin):
    list_display = ('get_dia_semana_display', 'activo', 'hora_apertura', 'hora_cierre')
    list_editable = ('activo', 'hora_apertura', 'hora_cierre')
    ordering = ('dia_semana',)
    
    def get_dia_semana_display(self, obj):
        return obj.get_dia_semana_display()
    get_dia_semana_display.short_description = 'Día de la Semana'