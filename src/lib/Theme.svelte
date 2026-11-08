<script lang="ts">
  import { onMount } from 'svelte';
  import { on } from 'svelte/events';

  const media = () => window.matchMedia('(prefers-color-scheme: dark)');

  let dark = $state(false);

  function apply(value: boolean) {
    dark = value;
    document.documentElement.classList.toggle('dark', value);
  }

  function setMode(value: boolean) {
    apply(value);

    if (media().matches === value) {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', value ? 'dark' : 'light');
    }
  }

  onMount(() => {
    dark = document.documentElement.classList.contains('dark');

    const matcher = media();
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) apply(matches);
    };

    return on(matcher, 'change', handleChange);
  });
</script>

<svelte:head>
  <script>
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  </script>
</svelte:head>

<button
  class="btn-sm m-4 size-6 shrink-0 p-0 hover:bg-yellow"
  onclick={() => setMode(!dark)}
  type="button"
  title="Toggle theme"
></button>
