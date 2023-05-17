<script lang="ts">
	import { onMount } from 'svelte';

	const words = ['router', 'burned', 'glitch', 'crooks', 'abcdef', 'flowse', 'pouthe', 'wanton'];
	let secretWord = words[Math.floor(Math.random() * words.length)];
	let matrix = Array(6)
		.fill('')
		.map(() => Array(6).fill(''));

	let currentRow = 0;
	let currentCol = 0;
	let isWinner = false;
	let isGameOver = false;

	const animationDuration = 500;

	function keyboardEvents() {
		document.body.onkeydown = (e) => {
			const key = e.key;

			if (key === 'Enter') {
				if (currentCol === 6) {
					// Get current word
					const word = getCurrentWord();

					if (isValidWord(word)) {
						revealWord(word);
						currentRow++;
						currentCol = 0;
					} else {
						alert('Invalid word');
					}
				}
			}
			if (key === 'Backspace') {
				// Delete word
				removeLetter();
			}
			if (isLetter(key)) {
				addLetter(key);
			}
		};
	}

	function getCurrentWord() {
		return matrix[currentRow].reduce((prev, curr) => prev + curr);
	}

	function isValidWord(word: string) {
		return words.includes(word.toLowerCase());
	}

	function isLetter(key: string) {
		return key.length === 1 && key.match(/[a-z]/i);
	}

	function addLetter(letter: string) {
		const box = document.querySelector(`[data-num="${currentRow}-${currentCol}"]`);
		box?.classList.add('animate-expand');

		if (currentCol === 6) return;

		matrix[currentRow][currentCol] = letter;
		currentCol++;
	}

	function removeLetter() {
		const box = document.querySelector(`[data-num="${currentRow}-${currentCol - 1}"]`);
		box?.classList.remove('animate-expand');

		if (currentCol === 0) return;

		matrix[currentRow][currentCol - 1] = '';
		currentCol--;
	}

	function revealWord(guess: string) {
		for (let i = 0; i < 6; i++) {
			const box = document.querySelector(`[data-num="${currentRow}-${i}"]`) as HTMLDivElement;

			setTimeout(() => {
				if (secretWord[i] === guess[i]) {
					box.classList.add('bg-green-500');
					box.classList.remove('border-neutral-600');
					box.classList.add('border-green-500');
				} else if (secretWord.includes(guess[i])) {
					box.classList.add('bg-yellow-500');
					box.classList.remove('border-neutral-600');
					box.classList.add('border-yellow-500');
				} else {
					box.classList.add('bg-neutral-600');
				}
			}, ((i + 1) * animationDuration) / 2);

			box.classList.add('animate-flip');
			box.style.animationDelay = `${(i * animationDuration) / 2}ms`;
		}

		setTimeout(() => {
			if (secretWord === guess) {
				isWinner = true;
			} else if (currentRow === 6) {
				isGameOver = true;
			}
		}, 3 * animationDuration);
	}

	function reset() {
		secretWord = words[Math.floor(Math.random() * words.length)];
		matrix = Array(6)
			.fill('')
			.map(() => Array(6).fill(''));

		currentRow = 0;
		currentCol = 0;
		isWinner = false;
		isGameOver = false;

		// Might be inefficient but who cares
		const box = document.querySelectorAll(`[data-num]`) as NodeListOf<HTMLDivElement>;

		box.forEach((box) => {
			box.classList.remove('bg-green-500');
			box.classList.remove('border-green-500');
			box.classList.remove('border-yellow-500');
			box.classList.add('border-neutral-600');
			box.classList.remove('bg-yellow-500');
			box.classList.remove('bg-neutral-600');
			box.classList.remove('animate-flip');
			box.style.animationDelay = '';
		});
	}

	onMount(() => {
		console.log(secretWord);
		keyboardEvents();
	});
</script>

<div class="grid grid-rows-6 grid-cols-6 place-items-center gap-2 max-w-lg">
	{#each matrix as rows, rowIdx (rowIdx)}
		{#each rows as letter, letterIdx (letterIdx)}
			<div
				class="w-16 h-16 border-2 border-neutral-600 uppercase text-white text-4xl grid place-items-center select-none"
				data-num={`${rowIdx}-${letterIdx}`}
			>
				{letter}
			</div>
		{/each}
	{/each}
</div>
<div class={`my-10 flex flex-col items-center ${isWinner || isGameOver ? 'visible' : 'invisible'}`}>
	<p class="text-white text-3xl mb-5">
		{#if isWinner}
			Great job!
		{:else if isGameOver}
			Better luck next time! The word was {secretWord.toUpperCase()}
		{/if}
	</p>
	<button class="text-black bg-white text-2xl px-4 py-2 rounded-lg max-w-fit" on:click={reset}
		>Restart</button
	>
</div>
