<script lang="ts">
	import { room } from '$lib/room';
	import { socket } from '$lib/socket';
	import { goto } from '$app/navigation';
	import { userId } from '$lib/socket';
</script>

<div class="text-center w-screen h-screen flex">
	<div class="m-auto">
		<div class="flex border border-black rounded-lg bg-white">
			<input
				class="text-4xl rounded-lg block p-2 text-center text-black"
				id="room"
				placeholder="Enter your room ID"
				bind:value={$room.id}
			/>
			<button
				class="text-4xl m-2 rounded-lg py-2 px-8 block text-white bg-green-500 hover:bg-green-400 transition-colors"
				on:click={async () => {
					await new Promise((resolve) => {
						socket.emit('join', $room.id, userId);
						resolve(true);
					});
					room.update((val) => ({ ...val, side: 'O' }));

					goto(`/room/${$room.id}`);
				}}>Join the room</button
			>
		</div>
		<div
			class="border-b-2 border-white text-center my-4 justify-center"
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
</div>
