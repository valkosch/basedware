<script lang="ts">
  import { page } from '$app/state';
  import { applications } from '$lib/apps';
  import AppCard from '$lib/apps/AppCard.svelte';
  import Button from '$lib/Button.svelte';
  import Card from '$lib/Card.svelte';
  import { Platform, platforms } from '$lib/platforms';
  import Toast from '$lib/Toast.svelte';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import zxcvbn from 'zxcvbn';

  import { registerSchema } from './schema';

  const { data } = $props();

  let currentStep = $state(1);

  // svelte-ignore state_referenced_locally
  const superform = superForm(data.form, {
    validators: zod4Client(registerSchema),
    resetForm: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        setTimeout(() => {
          currentStep = 2;
        }, 1750);
      }
    },
  });
  const { form: formData, message, enhance, submitting, allErrors } = superform;
  const passwordResult = $derived(zxcvbn($formData.password, [$formData.JID]));
  const passwordStrength = $derived(passwordResult.score);
  const passwordFeedback = $derived(passwordResult.feedback.suggestions.join('\n'));
  const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
  const passwordStrengthColor = $derived(passwordStrengthColors[passwordStrength] ?? 'bg-gray-500');
  const passwordStrengthBarWidth = $derived(((passwordStrength + 1) / 5) * 100);

  function detectOS(): Platform | undefined {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return Platform.Windows;
    if (ua.includes('android')) return Platform.Android;
    if (ua.includes('linux')) return Platform.Linux;
    if (ua.includes('iphone') || ua.includes('ipad')) return Platform.iOS;
    if (ua.includes('mac')) return Platform.macOS;
    return undefined;
  }

  let userOS: Platform | undefined = $state.raw(undefined);
  let filterOS: Platform | 'All platforms' = $state.raw('All platforms');

  onMount(() => {
    userOS = detectOS();
    if (userOS) filterOS = userOS;
  });

  const filteredApplications = $derived.by(() => {
    if (filterOS === 'All platforms') {
      return applications;
    }
    return applications.filter((app) => app.platforms.some((platform) => platform === filterOS));
  });
</script>

<svelte:head>
  <title>Register - ALTERCOM.</title>
  <meta
    name="description"
    content="Create your Jabbra ID and get set up with an XMPP client to start chatting on decentralized, open platforms."
  />
</svelte:head>

<div class="flex min-h-full flex-col px-6 py-12 lg:px-8">
  <div class="timeline md:w-3/4">
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      {#if currentStep == 1}
        <div transition:slide>
          <span class="timeline-step bg-blue-800">Step 1:</span>
          <h3 class="timeline-title">Create Your Account</h3>
          <p class="timeline-text">
            Your Jabbra ID is your unique identifier on the platform. It should be memorable and easy to share with
            others.
          </p>
          <Card class="mt-10 bg-white dark:bg-mist-800">
            {#if $message}
              <Toast
                class={page.status >= 400 ? 'nb-toast-error' : 'nb-toast-success'}
                icon={page.status >= 400 ? '✗' : '✓'}
              >
                {$message}
              </Toast>
            {/if}
            <form method="POST" class="space-y-6" use:enhance>
              <Field form={superform} name="JID">
                <Control>
                  {#snippet children({ props })}
                    <Label class="nb-label block">Jabbra ID</Label>
                    <div class="mt-2">
                      <div class="flex flex-row flex-wrap items-center justify-center gap-2">
                        <input
                          {...props}
                          bind:value={$formData.JID}
                          placeholder="Enter your Jabbra ID"
                          class="nb-input block min-w-40 flex-1 text-sm placeholder:text-sm"
                        />
                        <div class="font-weight-700 m-0 block text-sm text-gray-600 dark:text-gray-400">
                          @basedware.xyz
                        </div>
                      </div>
                    </div>
                  {/snippet}
                </Control>
                <FieldErrors class="nb-label mt-2 block text-sm text-red-500" />
              </Field>

              <div>
                <Field form={superform} name="password">
                  <Control>
                    {#snippet children({ props })}
                      <Label class="nb-label block">Password</Label>
                      <div class="mt-2">
                        <input
                          {...props}
                          class="nb-input block w-full text-sm placeholder:text-sm"
                          autocomplete="new-password"
                          placeholder="Enter your password"
                          type="password"
                          bind:value={$formData.password}
                        />
                      </div>
                    {/snippet}
                  </Control>
                </Field>
                <div class="mt-2 h-2 w-full bg-gray-200">
                  <div class={['h-full', passwordStrengthColor]} style:width="{passwordStrengthBarWidth}%"></div>
                </div>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{passwordFeedback}</p>
              </div>

              <Field form={superform} name="token">
                <Control>
                  {#snippet children({ props })}
                    <Label class="nb-label block">Invitation Token</Label>
                    <div class="mt-2">
                      <input
                        {...props}
                        bind:value={$formData.token}
                        readonly
                        class="nb-input block w-full text-sm text-gray-600 placeholder:text-sm dark:text-gray-400"
                      />
                    </div>
                  {/snippet}
                </Control>
                <FieldErrors class="nb-label mt-2 block text-sm text-red-500" />
              </Field>

              <Button
                type="submit"
                class="btn-blue disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-50"
                disabled={$allErrors.length > 0 || $submitting}
              >
                {$submitting ? 'Submitting...' : 'Register'}
              </Button>
            </form>
          </Card>
        </div>
      {/if}
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      {#if currentStep == 2}
        <div transition:slide>
          <span class="timeline-step bg-purple-800">Step 2:</span>
          <h3 class="timeline-title">Choose a Client and Download it</h3>
          <p class="timeline-text">
            After registering, you can choose a Jabber client that suits your needs. Since XMPP is an open protocol,
            there are many clients available for different platforms. Here is our recommendation:
          </p>
          {#if userOS}
            <div class="flex flex-row items-center gap-2">
              <p>Your detected platform: {userOS.name}</p>
              <userOS.icon size={24} />
            </div>
          {/if}
          <label for="platform-filter" class="sr-only">Filter clients by platform</label>
          <select id="platform-filter" bind:value={filterOS} class="nb-select ml-auto bg-white dark:bg-mist-800">
            <option value="All platforms">All Platforms</option>
            {#each platforms as platform (platform.name)}
              <option value={platform}>{platform.name}</option>
            {/each}
          </select>

          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredApplications as app (app.name)}
              <AppCard {app} />
            {/each}
          </div>
          <Button
            class="btn-yellow mt-5"
            onclick={() => {
              currentStep = 3;
            }}
          >
            I have a client! Whats next?
          </Button>
        </div>
      {/if}
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      {#if currentStep == 3}
        <div transition:slide>
          <span class="timeline-step bg-rose-800">Step 3:</span>
          <h3 class="timeline-title">Say Hello!</h3>
          <p class="timeline-text">
            Once you've downloaded and set up your client, you can login with your registered account and start chatting
            with your friends and family. Enjoy your new Jabbra ID!
          </p>
          <p class="timeline-text">
            You will also receive a little welcome message from us to get you started. If you have any questions or need
            help, feel free to reach out to me.
          </p>
        </div>

        <Button
          class="btn-pink mt-5"
          onclick={() => {
            currentStep = 2;
          }}
        >
          Go back
        </Button>
      {/if}
    </div>
  </div>
</div>
