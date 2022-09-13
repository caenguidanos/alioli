export async function redirect(pathname: string): Promise<void> {
   try {
      await navigation.navigate(pathname, { history: "replace" }).committed;
   } catch (error) {
      console.error(`Imposible to redirect: ${error}`);
   }
}

export async function navigate(pathname: string): Promise<void> {
   try {
      await navigation.navigate(pathname, { history: "push" }).finished;
   } catch (error) {
      console.error(`Imposible to navigate: ${error}`);
   }
}

export async function reload(): Promise<void> {
   try {
      await navigation.reload({ history: "replace" }).finished;
   } catch (error) {
      console.error(`Imposible to reload: ${error}`);
   }
}
