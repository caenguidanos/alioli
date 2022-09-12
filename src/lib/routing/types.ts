export interface PageProps {
   pathname: string;
   params: Record<string, string>;
   search: Record<string, string>;
   hash: string;
}
