export interface HorarioDTO {
  id: number;
  horaInicio: string;
  horaFin: string;
}

export interface ReservaRequestDTO {
  canchaId: number;
  horarioId: number;
  fecha: string;
}

export interface ReservaResponseDTO {
  idReserva: number;
  nombreCancha: string;
  nombreSede: string;
  imagenUrlCancha: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  canchaId: number;
}
