import { io } from 'socket.io-client';

export const socket = io();
export let userId = '';

socket.on('userId', (id) => {
	userId = id;
});

socket.on('message', (message: string) => {
	console.log(message);
});
