<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';
	import { Github, Home, Question } from '../assets/icons';
</script>

<nav class="shadow-accent relative z-50 flex h-20 items-center bg-neutral-900 px-20 py-4">
	<a href="https://github.com/xGihyun" type="button" target="_blank" rel="noreferrer">
		<Github style={'w-10 h-10 text-white'} />
	</a>
	<h1
		class="font-fenomen-slab-xcn-black pointer-events-none w-full text-center text-5xl text-white"
	>
		Woordle
	</h1>
	{#if $page.url.pathname === '/tutorial'}
		<a href="/">
			<Home style={'w-10 h-10 text-white'} />
		</a>
	{:else if $page.url.pathname === '/'}
		<a href="/tutorial">
			<Question style={'w-10 h-10 text-white'} />
		</a>
	{/if}
</nav>

<main class="h-full pt-40">
	<slot />
</main>
