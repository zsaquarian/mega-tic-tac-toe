import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';

interface Room {
	xPlayer?: string;
	oPlayer?: string;
}

const uid = new ShortUniqueId({
	dictionary: 'alphanum_upper',
	length: 8
});

const activeRooms: Record<string, Room> = {};

const joinRoom = (room: Room, user: string) => {
	if (!room.xPlayer) room.xPlayer = user;
	else if (!room.oPlayer) room.oPlayer = user;
};

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer: (server) => {
		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('userId', uid());

			socket.on('newRoom', (user: string, callback: (id: string) => void) => {
				const id = uid();
				activeRooms[id] = { xPlayer: user } as Room;
				socket.join(id);
				callback(id);
			});

			socket.on('join', (id: string, user: string) => {
				joinRoom(activeRooms[id], user);
				socket.join(id);
			});

			socket.on('quit', (id: string, user: string) => {
				if (!activeRooms[id]) {
					return;
				} else if (!activeRooms[id].xPlayer && !activeRooms[id].oPlayer) {
					delete activeRooms[id];
				} else if (activeRooms[id].xPlayer === user) delete activeRooms[id].xPlayer;
				else if (activeRooms[id].oPlayer === user) delete activeRooms[id].oPlayer;
				socket.leave(id);
			});

			socket.on('message', (message: string) => {
				const room = Array.from(socket.rooms)[1];
				io.to(room).emit('message', message);
			});
		});
	}
};
