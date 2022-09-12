export default async function IsAuthedGuard(): Promise<boolean> {
   return new Promise<boolean>((res) => {
      setTimeout(() => {
         res(true);
      }, 600);
   });
}
