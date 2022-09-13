export async function navigate(pathname: string): Promise<void> {
   await navigation.navigate(pathname).finished;
}
