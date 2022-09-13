<script lang="ts">
   import type { SvelteComponent } from "svelte";
   import { writable } from "svelte/store";

   import type { RouterGuardResult } from "../entity";

   export let children: typeof SvelteComponent[] = [];
   export let redirectTo: string | undefined = undefined;
   export let guard: RouterGuardResult | undefined | null = undefined;

   let canPass = writable<boolean>(false);

   $: {
      (async () => {
         if (redirectTo) {
            await navigation.navigate(redirectTo, { history: "replace" }).committed;
         }
      })();
   }

   $: {
      (async () => {
         if (guard) {
            canPass.set(guard.continue);

            if (!guard.continue) {
               if (guard.onExit) {
                  await guard.onExit();
               }
            }
         } else {
            canPass.set(true);
         }
      })();
   }
</script>

{#if !redirectTo && $canPass}
   {#if children.length === 1}
      <svelte:component this={children[0]} />
   {:else if children.length > 1}
      <svelte:component this={children[0]}>
         <svelte:self children={children.slice(1)} {redirectTo} />
      </svelte:component>
   {/if}
{/if}
