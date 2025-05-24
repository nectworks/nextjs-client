import DashboardMenu from '../_components/DashboardMenu/DashboardMenu';

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardMenu />
      <div className="dashboard-layout">
        {children}
      </div>
    </>
  );
}