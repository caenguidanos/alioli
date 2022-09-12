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
         <a href="/mail/recibidos/leidos/123?filter=true">123</a>
         <a href="/mail/recibidos/leidos/234?filter=false">234</a>
         <a href="/mail/recibidos/leidos/567?filter=false">567</a>
         <a href="/mail/recibidos/actuales">Actuales</a>
      </li>
   </ul>
</div>

<style>
   div {
      padding: 1.75rem;
      background-color: azure;
   }
</style>
