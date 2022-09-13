import { redirect } from "alioli";

export default async function IsAuthedGuard(): Promise<boolean> {
   return new Promise<boolean>((res) => setTimeout(() => res(false), 600)).finally(() => redirect("/"));
}
