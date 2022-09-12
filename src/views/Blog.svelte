<script>
   import { props } from "$router";

   $: {
      console.log($props);
   }
</script>

<h1>Blog</h1>

<a href="/">Go to index</a>
<a href="/blog/123">Go to Blog 123</a>
<a href="/blog/234">Go to Blog 234</a>
<a href="/contact">Go to contact</a>
<a href="/about">Go to about</a>
