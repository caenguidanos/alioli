<script lang="ts">
   import type { SvelteComponent } from "svelte";

   export let children: typeof SvelteComponent[] = [];
</script>

{#if children.length === 1}
   <svelte:component this={children[0]} />
{:else if children.length > 1}
   <svelte:component this={children[0]}>
      <svelte:self children={children.slice(1)} />
   </svelte:component>
{/if}
