<script>
   import { interval } from "rxjs";

   let t = interval(500);
</script>

<div>
   <nav>Layout 1 ({$t})</nav>
   <slot />
   <footer>Layout 1</footer>
</div>

<style>
   div {
      background-color: aliceblue;
   }
</style>
