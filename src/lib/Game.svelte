<script lang="ts">
	import { socket, userId } from './socket';
	import { room } from './room';

	export let grid: Cell[][] = [];
	export let won: Cell[] = new Array(9).fill('');

	socket.send(userId);

	socket.on('message', (message) => {
		if (message.includes('turnSwitch')) {
			turn = message.split(':')[1];
		}

		if (message.includes('changed')) {
			const position = message.split(':')[1];
			const i = parseInt(position.split(',')[0]);
			const j = parseInt(position.split(',')[1]);
			const _turn = position.split(',')[2];
			grid[i][j] = _turn;
			placeToClick = j;
			if (won[i] === '' && checkWin(grid[i])) {
				won[i] = turn;
			}
			turn = turn === 'O' ? 'X' : 'O';
		}

		if (message.includes('reset')) {
			for (let i = 0; i < 9; i++) {
				grid[i] = new Array(9).fill('');
			}
			turn = 'X';
			placeToClick = -1;
			won = new Array(9).fill('');
		}
	});

	for (let i = 0; i < 9; i++) {
		grid[i] = new Array(9).fill('');
	}

	export let turn: Cell = 'X';
	let placeToClick = -1;

	const checkWin = (grid: Cell[]): boolean => {
		if (grid[0] === grid[1] && grid[1] === grid[2] && grid[0] !== '') return true;
		if (grid[3] === grid[4] && grid[4] === grid[5] && grid[3] !== '') return true;
		if (grid[6] === grid[7] && grid[7] === grid[8] && grid[6] !== '') return true;

		if (grid[0] === grid[3] && grid[3] === grid[6] && grid[0] !== '') return true;
		if (grid[1] === grid[4] && grid[4] === grid[7] && grid[1] !== '') return true;
		if (grid[2] === grid[5] && grid[5] === grid[8] && grid[2] !== '') return true;

		if (grid[0] === grid[4] && grid[4] === grid[8] && grid[0] !== '') return true;
		if (grid[2] === grid[4] && grid[4] === grid[6] && grid[2] !== '') return true;

		return false;
	};

	$: if (checkWin(won)) {
		console.log(turn, 'wins');
	}

	$: myTurn = turn === $room.side;
</script>

<div class="flex flex-col justify-center h-screen">
	<div class="flex items-center justify-center mb-16 flex-col md:flex-row justify-center">
		<p class="text-6xl text-center">Room: {$room.id}</p>
		<button
			class="text-2xl bg-red-500 p-3 m-4 rounded-full"
			on:click={() => {
				socket.send('reset');
			}}>Reset</button
		>
	</div>
	<div
		class={`grid grid-cols-3 w-96 h-96 mx-auto mb-16 rounded-lg p-4 bg-slate-800 ${
			!myTurn ? 'bg-slate-50/5' : ''
		}`}
	>
		{#each grid as aGrid, i}
			<div
				class={`grid grid-cols-3 w-30 h-30 p-2 rounded-lg ${
					won[i] === 'O' ? 'bg-teal-600' : won[i] === 'X' ? 'bg-blue-600' : ''
				} ${i === placeToClick ? 'bg-green-500/75' : ''}`}
			>
				{#each aGrid as cell, j}
					<p
						class={`w-7 h-7 m-0.5 text-center align-middle rounded-md ${
							i % 2 === 0 ? 'bg-slate-700' : 'bg-slate-600'
						} ${cell === 'X' ? 'bg-blue-500' : cell === 'O' ? 'bg-teal-500' : ''}`}
						on:click={() => {
							if (!myTurn) return;
							if ((placeToClick === -1 || placeToClick === i) && cell === '') {
								socket.send(`changed:${i},${j},${turn}`);
							}
						}}
					>
						{cell}
					</p>
				{/each}
			</div>
		{/each}
	</div>

	<p class="text-4xl text-center">{myTurn ? 'Your' : "Opponent's"} Turn</p>
</div>
