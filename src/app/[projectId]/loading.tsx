import { LoadingPanel } from '@/components/states/loading-panel';

export default function ProjectLoading() {
  return (
    <main className="flex flex-col gap-6 p-4 sm:p-8">
      <LoadingPanel label="Loading the project" />
    </main>
  );
}
