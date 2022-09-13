<script>
   import { interval } from "rxjs";
   import { navigationGuardTransition, NavigationGuardTransition } from "alioli";

   let t = interval(1000);
</script>

<code>App: {$t}</code>

{#if $navigationGuardTransition === NavigationGuardTransition.START}
   <p>Cargando...</p>
{/if}

<slot />
