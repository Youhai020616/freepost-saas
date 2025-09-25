export default async function BillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="text-sm text-gray-600">Manage your subscription and invoices for workspace: {slug}</p>
      <div className="rounded border bg-white p-4 space-y-3">
        <div>Current plan: Free</div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border">Upgrade to Pro</button>
          <button className="px-3 py-2 rounded border">Upgrade to Team</button>
        </div>
      </div>
    </div>
  );
}
