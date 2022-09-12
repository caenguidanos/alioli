<script>
   import { interval } from "rxjs";

   let t = interval(500);
</script>

<div>
   <nav>Layout 3 ({$t})</nav>
   <slot />
   <footer>Layout 3</footer>
</div>

<style>
   div {
      background-color: rgb(228, 189, 181);
   }
</style>
