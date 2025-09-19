export default function ComposePage({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Compose</h1>
      <p className="text-sm text-gray-600">Create drafts and schedule posts across social accounts.</p>
      <div className="rounded border bg-white p-4 space-y-3">
        <textarea className="w-full border rounded p-2" rows={6} placeholder="Write something..." />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button className="px-3 py-2 rounded bg-black text-white">Save Draft</button>
          <button className="px-3 py-2 rounded border">Schedule</button>
          <button className="ml-auto text-gray-500">Characters: 0</button>
        </div>
      </div>
    </div>
  );
}
