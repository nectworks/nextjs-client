import Image from 'next/image';
import Link from 'next/link';
import notFound from '../public/not_found.webp';
import './notfound.css';

const PageNotFound = ({ statusCode }) => {
  const errorStatus = statusCode || 404;
  return (
    <>
      <div className="error-handle">
        <div className="error-content">
          <p className="error_status">{errorStatus}</p>
          <p className="error_message">
            Looks like the page went out to look for a job.
          </p>
          <p className="error__2msg">
            If you reached this error page by typing an address into our web
            browser, please verify that the spelling and capitalization are
            correct and try reloading the page
          </p>
          <p className="error_message or_message">Or</p>
          <Link href={'/'} className="go__home">
            Go home
          </Link>
        </div>
        <Image src={notFound} alt="Page not found" className="error-image" />
      </div>
    </>
  );
};

export default PageNotFound;
