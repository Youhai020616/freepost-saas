import { ReactNode } from "react";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // 简化布局，让仪表板组件处理所有的UI
  return <>{children}</>;
}
