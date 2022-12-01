import { io } from 'socket.io-client';

export const socketConnect = () => {
	const URL = 'http://localhost:4000';
	const socket = io(URL);

	// socket.onAny((event, ...args) => {
	// 	console.log(event, args);
	// });

	socket.on('connect_error', (err) => {
		console.log('Error while creating a socket connection');
	});

	socket.connect();
	return socket;
};
