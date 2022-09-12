<script>
   import { props } from "$router";

   $: {
      console.log($props);
   }
</script>

<h1>Contact</h1>

<a href="/">Go to index</a>
<a href="/about">Go to about</a>
