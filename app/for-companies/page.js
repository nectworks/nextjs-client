/*
  FileName: page.js
  Desc: Route page for the For Companies section.
  This file imports and renders the ForCompaniesPage component.
  Location: app/for-companies/page.js
*/

import ForCompaniesPage from '../(root)/home/components/ForCompaniesPage';
import Header from '../_components/Header/Header';
import Footer from '../_components/Footer/Footer';

const ForCompanies = () => {
  return (
    <>
      <Header />
      <ForCompaniesPage />
      <Footer />
    </>
  );
};

export default ForCompanies;