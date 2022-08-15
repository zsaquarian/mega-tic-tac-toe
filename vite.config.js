import { sveltekit } from '@sveltejs/kit/vite';
import { webSocketServer } from './src/ws';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), webSocketServer]
};

export default config;
