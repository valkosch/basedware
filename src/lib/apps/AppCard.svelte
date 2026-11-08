<script lang="ts">
  import Button from '$lib/Button.svelte';
  import Card from '$lib/Card.svelte';

  import type { Application } from './index';

  interface Props {
    app: Application;
  }

  const { app }: Props = $props();
</script>

<Card class="timeline-app bg-white dark:bg-mist-800">
  <img src={app.icon} alt={app.name} class="size-32 object-contain" />
  <h4 class="timeline-title">{app.name}</h4>
  <div class="align-center mt-1 flex flex-row items-center gap-2">
    {#each app.platforms as platform (platform.name)}
      <platform.icon size={32} />
    {/each}
  </div>
  <p class="timeline-text mt-1 text-gray-600 dark:text-gray-400">
    {app.description}
  </p>
  <Button href={app.url} class="mt-auto" target="_blank" rel="noopener noreferrer">Download</Button>
</Card>
