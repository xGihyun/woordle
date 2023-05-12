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
		const animationDuration = 500;

		for (let i = 0; i < 6; i++) {
			const box = document.querySelector(`[data-num="${currentRow}-${i}"]`) as HTMLDivElement;

			setTimeout(() => {
				if (secretWord[i] === guess[i]) {
					box.classList.add('bg-green-500');
				} else if (secretWord.includes(guess[i])) {
					box.classList.add('bg-yellow-500');
				} else {
					box.classList.add('bg-neutral-600');
				}
			}, ((i + 1) * animationDuration) / 2);

			box.classList.add('animate-flip');
			box.style.animationDelay = `${(i * animationDuration) / 2}ms`;
		}

		isGameOver = currentRow === 6;

		setTimeout(() => {
			if (secretWord === guess) {
				isWinner = true;
			} else if (isGameOver) {
				alert(`Nice try! The word was ${secretWord}.`);
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
			if (box.classList.contains('bg-green-500')) {
				box.classList.remove('bg-green-500');
			}
			if (box.classList.contains('bg-yellow-500')) {
				box.classList.remove('bg-yellow-500');
			}
			if (box.classList.contains('bg-neutral-600')) {
				box.classList.remove('bg-neutral-600');
			}
			if (box.classList.contains('animate-flip')) {
				box.classList.remove('animate-flip');
			}

			box.style.animationDelay = '';
		});
	}

	onMount(() => {
		console.log(secretWord);
		keyboardEvents();
	});
</script>

<div class="grid grid-rows-box grid-cols-box place-items-center gap-2 max-w-lg mx-auto">
	{#each matrix as rows, rowIdx (rowIdx)}
		{#each rows as letter, letterIdx (letterIdx)}
			<div
				class="w-16 h-16 border-2 border-neutral-500 uppercase text-white text-4xl grid place-items-center select-none"
				data-num={`${rowIdx}-${letterIdx}`}
			>
				{letter}
			</div>
		{/each}
	{/each}
</div>
<div class={`my-10 flex flex-col items-center ${isWinner ? 'visible' : 'invisible'}`}>
	<p class="text-white text-3xl mb-5">Great job!</p>
	<button class="text-black bg-white text-2xl px-4 py-2 rounded-lg max-w-fit" on:click={reset}
		>Restart</button
	>
</div>
