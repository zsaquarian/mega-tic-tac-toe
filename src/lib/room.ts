import { writable } from 'svelte/store';

interface Room {
	id: string;
	side: 'X' | 'O';
}

export const room = writable({} as Room);
