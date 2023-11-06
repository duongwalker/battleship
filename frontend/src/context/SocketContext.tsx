import React, { ReactNode, createContext, useContext } from 'react';
import { Socket } from 'socket.io-client'; // Import the Socket type from socket.io-client
import * as io from 'socket.io-client'
interface SocketContextProps {
  socket: Socket;
  children: ReactNode;
}
export const socket = io.connect("http://localhost:3001");
export const SocketContext = createContext<SocketContextProps | undefined>(undefined);

// export const SocketProvider: React.FC<SocketContextProps> = ({ socket,children }) => {
//   return <SocketContext.Provider value={{ socket, children }}>{children}</SocketContext.Provider>;
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return context.socket;
// };
