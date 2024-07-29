/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Report Jobs Page` component. The `page` 
    component returns the `Report Jobs Page` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import ReportedJobs from './ReportedJobs/ReportedJobs';

const ReportJobsPage = () => {
  return <ReportedJobs />;
};

export default ReportJobsPage;
