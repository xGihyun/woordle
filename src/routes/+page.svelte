<script lang="ts">
	import { onMount } from 'svelte';

	const words = ['router', 'burned', 'glitch', 'crooks', 'abcdef', 'flowse', 'pouthe', 'wanton'];
	let secretWord = words[Math.floor(Math.random() * words.length)];
	let matrix = Array(6)
		.fill('')
		.map(() => Array(6).fill(''));

	let currentRow = 0;
	let currentCol = 0;

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
		if (currentCol === 6) return;

		matrix[currentRow][currentCol] = letter;
		currentCol++;
	}

	function removeLetter() {
		if (currentCol === 0) return;

		matrix[currentRow][currentCol - 1] = '';
		currentCol--;
	}

	function revealWord(guess: string) {
		for (let i = 0; i < 6; i++) {
			const box = document.querySelector(`[data-num="${currentRow}-${i}"]`);
			const letter = box?.textContent as string;

			if (secretWord[i] === guess[i]) {
				box?.classList.add('bg-green-500');
			} else if (secretWord.includes(guess[i])) {
				box?.classList.add('bg-yellow-500');
			} else {
				box?.classList.add('bg-neutral-600');
			}
		}

		const isWinner = secretWord === guess;
		const isGameOver = currentRow === 6;

		if (isWinner) {
			alert('Congratulations!');
		} else if (isGameOver) {
			alert(`Nice try! The word was ${secretWord}.`);
		}
	}

	onMount(() => {
		console.log(secretWord);
		keyboardEvents();
	});
</script>

<div class="grid grid-rows-6 grid-cols-6 place-items-center gap-4 max-w-lg">
	{#each matrix as rows, rowIdx (rowIdx)}
		{#each rows as letter, letterIdx (letterIdx)}
			<div
				class="w-16 h-16 border-2 border-white uppercase text-white text-5xl grid place-items-center"
				data-num={`${rowIdx}-${letterIdx}`}
			>
				{letter}
			</div>
		{/each}
	{/each}
</div>
