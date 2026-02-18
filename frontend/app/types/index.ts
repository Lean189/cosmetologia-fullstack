export type Servicio = {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion_minutos: number;
    activo: boolean;
};

export type Cliente = {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
};

export type Cita = {
    id: string;
    cliente_id: string;
    servicio_id: string;
    fecha: Date;
    hora_inicio: string;
    estado: 'P' | 'C' | 'A'; // Pendiente, Confirmada, Cancelada
    notas?: string;
};

export type BloqueoHorario = {
    id: string;
    fecha: Date;
    razon?: string;
};

export type ConfiguracionHorario = {
    id: string;
    dia_semana: number; // 0=Lunes, 6=Domingo
    activo: boolean;
    hora_apertura: string;
    hora_cierre: string;
};
