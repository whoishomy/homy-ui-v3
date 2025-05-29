import { promises as fs } from 'fs';
import path from 'path';
import { SnapshotDashboard } from '@/components/cleanshot/SnapshotDashboard';

async function getScreenshotData() {
  const filePath = path.join(process.cwd(), 'memory', 'screenshot-log.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function CleanShotPage() {
  const data = await getScreenshotData();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🎯 CleanShot Documentation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">
            Interactive dashboard for managing and viewing component screenshots. Toggle between
            grid and list views, filter by status, and hover over screenshots for detailed
            information.
          </p>
        </header>

        <SnapshotDashboard data={data} />
      </div>
    </main>
  );
}
