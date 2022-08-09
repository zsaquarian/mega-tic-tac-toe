<script lang="ts">
	import Game from '$lib/Game.svelte';
	import { page } from '$app/stores';
	import { socket, userId } from '$lib/socket';
	import { beforeNavigate } from '$app/navigation';

	beforeNavigate(() => {
		socket.emit('quit', $page.params.id, userId);
	});
</script>

<Game />
