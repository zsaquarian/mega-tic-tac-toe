<script lang="ts">
	import { room } from '$lib/room';
	import { socket } from '$lib/socket';
	import { goto } from '$app/navigation';
	import { userId } from '$lib/socket';
	import { version } from '$lib/version';
</script>

<div class="text-center w-full h-screen flex">
	<div class="m-auto flex flex-col p-2">
		<div class="flex rounded-lg bg-white flex-col md:flex-row text-4xl">
			<input
				class="rounded-lg block p-2 text-center text-black"
				id="room"
				placeholder="Enter your room ID"
				bind:value={$room.id}
			/>
			<button
				class="rounded-lg py-2 md:px-8 m-2 block text-white bg-green-500 hover:bg-green-400 transition-colors"
				on:click={async () => {
					if (!$room.id) return;
					await new Promise((resolve) => {
						socket.emit('join', $room.id, userId);
						resolve(true);
					});
					room.update((val) => ({ ...val, side: 'O' }));

					goto(`/room/${$room.id}`);
				}}>Join <span class="hidden lg:inline">the room</span></button
			>
		</div>
		<div
			class="border-b-2 border-white text-center my-4 justify-center hidden md:block"
			style="line-height: 0.1rem;"
		>
			<span class="bg-slate-800 px-4">OR</span>
		</div>
		<button
			class="text-4xl my-2 mx-auto rounded-lg p-2 block text-white hover:text-green-400 transition-colors"
			on:click={async () => {
				let newRoom = '';
				await new Promise((resolve) => {
					socket.emit('newRoom', userId, (message) => {
						room.update((_) => ({ id: message, side: 'X' }));
						newRoom = message;
						resolve(newRoom);
					});
				});

				goto(`/room/${newRoom}`);
			}}>Create new game</button
		>
	</div>
	<p class="absolute right-2 bottom-2">
		<a href="https://github.com/zsaquarian/mega-tic-tac-toe">Source code</a><br />
		v{version}
	</p>
</div>
