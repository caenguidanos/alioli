import { redirect, type Guard } from "alioli";

function sleep(ms: number): Promise<void> {
   return new Promise<void>((res) => setTimeout(() => res(), ms));
}

const isAuthedGuard: Guard = async () => {
   await sleep(500);

   return {
      continue: false,
      onExit: async () => {
         await redirect("/about");
      },
   };
};

export default isAuthedGuard;
