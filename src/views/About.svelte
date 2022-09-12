<script>
   import { props } from "$router";

   $: {
      console.log($props);
   }
</script>

<h1>About</h1>

<a href="/contact">Go to contact</a>
<a href="/">Go to index</a>
