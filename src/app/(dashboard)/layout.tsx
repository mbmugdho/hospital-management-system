export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Phase 3 will build Sidebar + Navbar here */}
      {children}
    </div>
  );
}