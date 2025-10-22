import api from "../lib/axios";

const isAxiosError = (error: any): boolean => {
  return error && error.isAxiosError === true;
};

export async function crearSolicitud(data: any) {
  try {
    const { data: res } = await api.post("/solicitudes", data);
    return res; // { message, solicitud }
  } catch (err) {
    if (isAxiosError(err)) {
      throw err; // mantiene err.response.data.message
    }
    throw err; // error desconocido
  }
}

export async function obtenerSolicitudesPorFecha(fecha: string) {
  try {
    const response = await api.get(`/solicitudes/fecha?fecha=${fecha}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener solicitudes por fecha"
      );
    } else {
      throw new Error("Error desconocido al obtener solicitudes por fecha");
    }
  }
}

/**
 * Obtiene todas las solicitudes (admin o staff).
 */
export async function obtenerSolicitudes() {
  try {
    const response = await api.get("/solicitudes");
    return response.data; // [ ... ]
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener las solicitudes"
      );
    } else {
      throw new Error("Error desconocido al obtener las solicitudes");
    }
  }
}

/**
 * Obtiene una solicitud por su ID.
 */
export async function obtenerSolicitudPorId(id: string) {
  try {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data; // { ...solicitud }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener la solicitud"
      );
    } else {
      throw new Error("Error desconocido al obtener la solicitud");
    }
  }
}

/**
 * Actualiza el estado de una solicitud.
 */
export async function actualizarSolicitud(id: string, data: any) {
  try {
    const response = await api.patch(`/solicitudes/${id}`, data);
    return response.data; // { message, solicitud }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al actualizar la solicitud"
      );
    } else {
      throw new Error("Error desconocido al actualizar la solicitud");
    }
  }
}

/**
 * Elimina una solicitud por su ID.
 */
export async function eliminarSolicitud(id: string) {
  try {
    const response = await api.delete(`/solicitudes/${id}`);
    return response.data; // { message }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al eliminar la solicitud"
      );
    } else {
      throw new Error("Error desconocido al eliminar la solicitud");
    }
  }
}

export async function obtenerHorariosOcupadosMovilidad(fechaISO?: string) {
  try {
    const { data } = await api.get<string[]>(
      "/solicitudes/movilidad/ocupadas",
      {
        params: { fecha: fechaISO },
      }
    );
    return data; // ["09:00", "16:30", ...]
  } catch (err) {
    if (isAxiosError(err) && err.response)
      throw new Error(
        err.response.data.message || "Error al obtener horarios ocupados"
      );
    throw new Error("Error desconocido al obtener horarios ocupados");
  }
}
