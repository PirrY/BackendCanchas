export interface SedeDTO {
  id: number;
  nombre: string;
}

export interface TipoCanchaDTO {
  id: number;
  nombre: string;
}

export interface CanchaOutDTO {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  imagenUrl: string;
  nombreSede: string;
  nombreTipoCancha: string;
}
