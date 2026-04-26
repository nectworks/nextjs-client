'use client';

import { useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';
import { UserContext } from '@/context/User/UserContext';
import DashboardMenu from '../DashboardMenu/DashboardMenu';

function ProtectedDashboardShell({ children, showDashboard = true }) {
  const { userState, authCheckComplete, refreshUser } = useContext(UserContext);
  const [user] = userState;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasRetriedAuthRef = useRef(false);

  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }, [currentPath]);

  useEffect(() => {
    if (!authCheckComplete || user) return;

    const hasAuthFlag =
      typeof window !== 'undefined' &&
      localStorage.getItem('userAuthenticated') === 'true';

    if (hasAuthFlag && !hasRetriedAuthRef.current) {
      hasRetriedAuthRef.current = true;
      refreshUser();
      return;
    }

    router.replace(`/log-in?redirect=${encodeURIComponent(currentPath)}`);
  }, [authCheckComplete, currentPath, refreshUser, router, user]);

  useEffect(() => {
    if (user) {
      hasRetriedAuthRef.current = false;
    }
  }, [user]);

  if (!authCheckComplete || !user) {
    return (
      <div className="authenticatingLoader">
        <ClipLoader size={50} />
      </div>
    );
  }

  if (!showDashboard) {
    return children;
  }

  return (
    <>
      <DashboardMenu />
      <div className="dashboard-layout">{children}</div>
    </>
  );
}

export default ProtectedDashboardShell;
