/*
    FileName - Page.js
    Desc - This file defines the HomePage component, which serves as the landing page
    of the Nectworks website. It includes the Header, Home, and Footer components
    to create a complete page layout. The file also defines and exports the metadata
    for the page, including the title, description, keywords, and open graph data
    for social media sharing. The metadata is designed to enhance SEO and provide
    detailed information for social sharing.
*/

import Home from './(root)/home/Home';
import Header from './_components/Header/Header';
import Footer from './_components/Footer/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
};

export default HomePage;
