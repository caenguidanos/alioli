/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="urlpattern-polyfill" />

interface NavigationHistoryEntry {
   id: string;
   index: number;
   key: string;
   ondispose: null;
   sameDocument: boolean;
   url: string;
   getState: () => any;
}

declare var navigation: {
   addEventListener: (name: string, cb: (ev: any) => void) => void;
   currentEntry: NavigationHistoryEntry;
   destination: NavigationHistoryEntry;
   traverseTo: (entryKey: string) => void;
   reload: (options?: { state?: any; history?: "push" | "replace" }) => {
      finished: Promise<void>;
      committed: Promise<void>;
   };
   navigate: (
      path: string,
      options?: { history?: "push" | "replace" }
   ) => {
      finished: Promise<void>;
      committed: Promise<void>;
   };
};
