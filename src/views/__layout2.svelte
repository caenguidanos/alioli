<script>
   import { interval } from "rxjs";

   let t = interval(500);
</script>

<div>
   <nav>Layout 2 ({$t})</nav>
   <slot />
   <footer>Layout 2</footer>
</div>

<style>
   div {
      background-color: rgb(181, 228, 181);
   }
</style>
