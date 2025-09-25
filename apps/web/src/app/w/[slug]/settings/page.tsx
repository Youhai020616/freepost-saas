export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-gray-600">Workspace preferences, members and roles, and provider connections.</p>
      <div className="rounded border bg-white p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">Workspace Name<input className="mt-1 w-full border rounded p-2" placeholder="My Workspace" /></label>
          <label className="text-sm">Slug<input className="mt-1 w-full border rounded p-2" placeholder="my-workspace" /></label>
        </div>
        <div className="text-sm text-gray-500">Members (coming soon)</div>
        <div className="text-sm text-gray-500">Provider Connections (coming soon)</div>
      </div>
    </div>
  );
}
