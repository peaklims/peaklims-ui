import { LoadingSpinner } from "./loading-spinner";

export function FullScreenLoading() {
  return (
    <div className="relative flex items-center justify-center w-full bg-white isolate min-h-svh max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <LoadingSpinner />
    </div>
  );
}
