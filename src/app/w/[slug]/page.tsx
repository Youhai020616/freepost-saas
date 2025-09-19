export default function WorkspaceDashboard({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-600">Overview of scheduled posts, recent activity, and account status.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border bg-white p-4">Scheduled: --</div>
        <div className="rounded border bg-white p-4">Drafts: --</div>
        <div className="rounded border bg-white p-4">Published (7d): --</div>
      </div>
    </div>
  );
}
