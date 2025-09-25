export default function MediaPage({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Media Library</h1>
      <p className="text-sm text-gray-600">Upload and manage images and videos.</p>
      <div className="rounded border bg-white p-4 space-y-3">
        <input type="file" multiple />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="aspect-square bg-gray-100 rounded" />
          <div className="aspect-square bg-gray-100 rounded" />
          <div className="aspect-square bg-gray-100 rounded" />
          <div className="aspect-square bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
