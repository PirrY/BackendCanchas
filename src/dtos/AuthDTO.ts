export interface LoginInDTO {
  correo: string;
  password: string;
}

export interface LoginOutDTO {
  token: string;
}

export interface RegisterInDTO {
  nombre: string;
  correo: string;
  password: string;
}
