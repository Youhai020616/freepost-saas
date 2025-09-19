import Link from "next/link";
import { ReactNode } from "react";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;
  const base = `/w/${slug}`;
  const nav = [
    { href: `${base}`, label: "Dashboard" },
    { href: `${base}/compose`, label: "Compose" },
    { href: `${base}/media`, label: "Media" },
    { href: `${base}/schedule`, label: "Schedule" },
    { href: `${base}/billing`, label: "Billing" },
    { href: `${base}/settings`, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-6">
          <Link href={base} className="font-semibold text-gray-900">
            freepost
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-gray-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto text-xs text-gray-500">workspace: {slug}</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
