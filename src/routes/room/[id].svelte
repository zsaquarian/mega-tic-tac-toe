<script lang="ts">
	import Game from '$lib/Game.svelte';
	import Modal from 'svelte-simple-modal';
  import { browser } from '$app/env';
	import { page } from '$app/stores';
	import { socket, userId } from '$lib/socket';
	import { beforeNavigate } from '$app/navigation';

	beforeNavigate(() => {
		socket.emit('quit', $page.params.id, userId);
	});
</script>

<svelte:head>
	<title>Playing room: {$page.params.id}</title>
</svelte:head>

{#if browser}
	<Modal>
		<Game />
	</Modal>
{/if}
