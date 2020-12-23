import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000', {
  path: '/ws',
  withCredentials: true,
});

socket.connect();

socket.on('disconnect', () => {
  console.log(socket.id);
});

socket.on('connect_error', (error) => {
  console.error(error);
});

export default socket;
