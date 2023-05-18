<script lang="ts">
	import { onMount } from 'svelte';

	// const words = ['router', 'burned', 'glitch', 'crooks', 'abcdef', 'flowse', 'pouthe', 'wanton'];
	const words = ['router', 'burned', 'glitch', 'crooks', 'wanton'];
	let secretWord = words[Math.floor(Math.random() * words.length)];
	const currentSecretWord = secretWord;
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
		document.addEventListener('keydown', function (event) {
			event.preventDefault();
		});

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
			box.classList.remove('animate-expand');
			box.style.animationDelay = '';
		});
	}

	onMount(() => {
		console.log(secretWord);
		keyboardEvents();
	});
</script>

<div class="flex justify-center">
	<div
		class="grid h-[400px] min-h-[300px] w-[400px] min-w-[300px] grid-cols-6 grid-rows-6 place-items-center gap-[1px] sm:gap-4"
	>
		{#each matrix as rows, rowIdx (rowIdx)}
			{#each rows as letter, letterIdx (letterIdx)}
				<div
					class="grid h-14 w-14 select-none place-items-center border-2 border-neutral-600 text-4xl uppercase text-white sm:h-16 sm:w-16"
					data-num={`${rowIdx}-${letterIdx}`}
				>
					{letter}
				</div>
			{/each}
		{/each}
	</div>
</div>

<!-- {#if isWinner || isGameOver} -->
<div class="absolute left-0 top-0 z-10 h-full w-full overflow-hidden">
	<div
		class={`absolute left-0 top-0 z-10 h-full w-full bg-black transition-[opacity] duration-1000 ${
			isWinner || isGameOver ? 'opacity-50' : 'opacity-0 delay-700'
		}`}
	/>
	<div class="relative z-20 flex h-full items-center justify-center">
		<div
			class={`flex flex-col items-center justify-center rounded-lg bg-neutral-800 p-6 ${
				isWinner || isGameOver ? 'block' : 'hidden'
			}`}
		>
			<span class="mb-10 text-4xl text-white">
				{#if isWinner}
					Great job!
				{:else if isGameOver}
					Better luck next time!
				{/if}
			</span>
			<p class="mb-5 text-2xl">
				<span class="text-white">The word was</span>
				<a
					class="text-red-500 transition-colors duration-300 hover:text-red-700 hover:underline"
					href={`https://www.dictionary.com/browse/${currentSecretWord}`}
					target="_blank"
					rel="noreferrer">{secretWord.toUpperCase()}</a
				>
			</p>
			<button
				class="max-w-fit rounded-lg bg-white px-3 py-1 text-xl text-black transition-colors duration-300 hover:bg-neutral-400"
				on:click={reset}>Try Again!</button
			>
		</div>
	</div>
</div>
<!-- {/if} -->
