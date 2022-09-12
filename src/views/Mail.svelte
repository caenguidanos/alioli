<script>
   import { props } from "$router";

   $: {
      console.log($props);
   }
</script>

<div>
   <h2>Mail</h2>

   <ul>
      <li>
         <a href="/mail/retrieved/pending">Actuales</a>
      </li>
   </ul>
</div>

<style>
   div {
      padding: 1.75rem;
      background-color: azure;
   }
</style>
