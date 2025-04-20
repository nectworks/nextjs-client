import Header from '../_components/Header/Header';
import Footer from '../_components/Footer/Footer';

const RootLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default RootLayout;
