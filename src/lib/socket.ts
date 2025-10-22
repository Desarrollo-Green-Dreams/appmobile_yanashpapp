import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = (propiedad: string) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { propiedad },
      autoConnect: false, // importante para controlar la conexión manualmente
    });
  }
};

export { socket };
