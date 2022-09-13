import { navigate } from "alioli";

export default async function (pathname: string) {
   await navigate(pathname);
}
