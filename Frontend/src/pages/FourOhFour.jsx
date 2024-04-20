import {Link} from 'react-router-dom';
import './404.css';

const FourOhFour = () => {
  return (
    <div id='notfound'>
      <div className='notfound-bg'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className='notfound'>
        <div className='notfound-404'>
          <h1>404</h1>
        </div>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        <Link to='/' className='notfound-link'>
          Home
        </Link>
        {/* <div className='notfound-social'>
          <Link href='#'>
            <i className='fa fa-facebook'></i>
          </Link>
          <Link href='#'>
            <i className='fa fa-twitter'></i>
          </Link>
          <Link href='#'>
            <i className='fa fa-pinterest'></i>
          </Link>
          <Link href='#'>
            <i class='fa fa-google-plus'></i>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default FourOhFour;
