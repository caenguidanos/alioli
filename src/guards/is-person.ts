export default async function IsPerson(): Promise<boolean> {
   return new Promise<boolean>((res) => {
      res(true);
   });
}
