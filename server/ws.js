import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';

const uid = new ShortUniqueId({
	dictionary: 'alphanum_upper',
	length: 8
});

const activeRooms = {};

const joinRoom = (room, user) => {
	if (!room) return;
	if (!room.xPlayer) room.xPlayer = user;
	else if (!room.oPlayer) room.oPlayer = user;
};

// @ts-ignore
export const injectSocketIO = (server) => {
		const io = new Server(server);

		io.on('connection', (socket) => {
			socket.emit('userId', uid());

			socket.on('newRoom', (user, callback) => {
				const id = uid();
				activeRooms[id] = { xPlayer: user };
				socket.join(id);
				callback(id);
			});

			socket.on('join', (id, user) => {
				joinRoom(activeRooms[id], user);
				socket.join(id);
			});

			socket.on('quit', (id, user) => {
				if (!activeRooms[id]) {
					return;
				} else if (!activeRooms[id].xPlayer && !activeRooms[id].oPlayer) {
					delete activeRooms[id];
				} else if (activeRooms[id].xPlayer === user) delete activeRooms[id].xPlayer;
				else if (activeRooms[id].oPlayer === user) delete activeRooms[id].oPlayer;
				socket.leave(id);
			});

			socket.on('message', (message) => {
				const room = Array.from(socket.rooms)[1];
				io.to(room).emit('message', message);
			});
		});
	}

export const webSocketServer = {
	name: 'webSocketServer',
	// @ts-ignore
	configureServer: (server) => {
		injectSocketIO(server.httpServer);
	}
};
