import AdminUserContextProvider from '@/context/AdminUserContext/AdminUserContext';

const Layout = ({ children }) => {
  return <AdminUserContextProvider>{children}</AdminUserContextProvider>;
};

export default Layout;
