<script lang="ts">
  import { resolve } from '$app/paths';
  import favicon from '$lib/assets/favicon.svg';
  import Progress from '$lib/Progress.svelte';
  import Theme from '$lib/Theme.svelte';

  import '@fontsource/syne/800.css';
  import '@fontsource/space-grotesk/700.css';
  import '@fontsource/inter/500.css';
  import interFont from '@fontsource/inter/files/inter-latin-500-normal.woff2?url';
  import spaceGroteskFont from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url';
  import syneFont from '@fontsource/syne/files/syne-latin-800-normal.woff2?url';

  import '../app.css';

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preload" as="font" type="font/woff2" href={syneFont} crossorigin="anonymous" />
  <link rel="preload" as="font" type="font/woff2" href={spaceGroteskFont} crossorigin="anonymous" />
  <link rel="preload" as="font" type="font/woff2" href={interFont} crossorigin="anonymous" />
</svelte:head>

<nav class="nav">
  <div class="flex w-full items-center justify-between px-4">
    <Theme />
    <a href={resolve('/')} class="nav-logo">
      ALTERCOM
      <span class="text-red-500">.</span>
    </a>
  </div>
</nav>

<Progress />
<main>
  {@render children()}
</main>
