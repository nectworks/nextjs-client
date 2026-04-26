import ProtectedDashboardShell from '../_components/ProtectedDashboardShell/ProtectedDashboardShell';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedDashboardShell>{children}</ProtectedDashboardShell>
  );
}
