<script>
   import { props } from "$router";

   $: {
      console.log($props);
   }
</script>

<div>
   <h1>Mail2</h1>

   <a href="/">Go to index</a>
   <a href="/blog/123">Go to Blog 123</a>
   <a href="/blog/234">Go to Blog 234</a>
   <a href="/contact">Go to contact</a>
   <a href="/about">Go to about</a>
   <a href="/mail/recibidos/leidos/123?filter=true">123</a>
   <a href="/mail/recibidos/leidos/234?filter=false">234</a>
   <a href="/mail/recibidos/leidos/567?filter=false">567</a>
</div>

<style>
   div {
      padding: 1.75rem;
      background-color: azure;
   }
</style>
