import AdminUserContextProvider from '@/context/AdminUserContext/AdminUserContext';

const Layout = ({ children }) => {
  console.log('Children in Layout:', children);
  return <AdminUserContextProvider>{children}</AdminUserContextProvider>;
};

export default Layout;
