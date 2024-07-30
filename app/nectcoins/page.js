/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `NectCoins` component. The `page` 
    component returns the `NectCoins` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import NectCoins from './NectCoins/NectCoins';

const NectCoinsPage = () => {
  return <NectCoins />;
};

export default NectCoinsPage;
