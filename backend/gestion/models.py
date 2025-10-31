from django.db import models

class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    duracion_minutos = models.IntegerField(help_text="Duración en minutos")
    activo = models.BooleanField(default=True)
    def __str__(self):
        return self.nombre


class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    def __str__(self):
        return f'{self.nombre} {self.apellido}'

class Cita(models.Model):
    ESTADO_CHOICES = [('P', 'Pendiente'), ('C', 'Confirmada'), ('A', 'Cancelada')]
    cliente = models.ForeignKey('cliente', on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    estado =models.CharField(max_length=1, choices=ESTADO_CHOICES, default='P')
    class Meta:
        unique_together = ('fecha', 'hora_inicio',)
        ordering = ['fecha', 'hora_inicio']
    def __str__(self): return f'Cita de {self.cliente} para {self.servicio}'

class BloqueoHorario(models.Model):
    fecha = models.DateField(unique=True)
    razon = models.CharField(max_length=255, blank=True)
    def __str__(self):
        return f'Bloqueado : {self.fecha}'
