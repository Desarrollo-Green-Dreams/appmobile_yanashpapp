export interface DatosReserva {
  nombre: string;
  correo: string;
  telefono: string;
  propiedad: string;
  checkIn: string;
  checkOut: string;
  dniPasaporte: string;
}

export interface CheckinData {
  name: string;
  email: string;
  phone: string;
  property: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface CheckInsActivosResponse {
  status: "ok" | "not_found" | "error";
  total?: number;
  data?: CheckinData[];
  message?: string;
}

export const userSchema = {
  safeParse: (data: any) => ({ success: true, data })
};