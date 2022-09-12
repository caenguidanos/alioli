<div>Cargando...</div>

<style>
   div {
      position: fixed;
      display: grid;
      place-items: center;
      top: 0;
      background-color: white;
      color: black;
      min-height: 100vh;
      min-width: 100vw;
      font-size: 2rem;
   }

   @supports (backdrop-filter: blur(0px)) {
      div {
         background-color: rgba(255, 255, 255, 0.6);
         backdrop-filter: blur(10px);
      }
   }
</style>
