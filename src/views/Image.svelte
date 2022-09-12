<script>
   import { props } from "$router";

   $: {
      console.log($props);
   }
</script>

<h1>Images</h1>

<a href="/">Go to index</a>
<a href="/contact">Go to contact</a>
<a href="/about">Go to about</a>
