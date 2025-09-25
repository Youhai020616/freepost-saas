export default async function SchedulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <p className="text-sm text-gray-600">View and manage scheduled posts.</p>
      <div className="rounded border bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded border p-3">09:00 — Post A</div>
          <div className="rounded border p-3">14:30 — Post B</div>
          <div className="rounded border p-3">18:15 — Post C</div>
        </div>
      </div>
    </div>
  );
}
