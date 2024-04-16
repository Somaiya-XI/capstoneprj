import {Link} from 'react-router-dom';
import '../../pages/Account/form.css';
import {SimpleLogo} from '../Icons.jsx';
import {CustomErrorAlert} from '../../Components/index.jsx';

const FormsContainer = ({
  formIcon: IconComponent,
  formIconProps,
  formTitle,
  formImage,
  handleSubmit,
  formLinks,
  errors,
  children,
}) => {
  return (
    <div className='clear-styles container-fluid'>
      <div className='form-logo-btn'>
        <Link to='/'>
          <SimpleLogo fontSize='38px' />
        </Link>
      </div>
      <div className='row'>
        <div className=' col-lg-4 login-section-wrapper'>
          <div className='login-wrapper my-auto mx-auto'>
            {errors && <CustomErrorAlert error={errors} />}
            <h1 className='login-title inline d-inline'>
              {IconComponent && <IconComponent className='d-inline' {...formIconProps} />}
              {formTitle}
            </h1>
            <form onSubmit={handleSubmit}>{children}</form>
            {formLinks &&
              formLinks.map((link, index) => (
                <Link key={index} to={link.link} className='forgot-password-link mr-4' style={{color: '#b0adad'}}>
                  {link.text}
                </Link>
              ))}
          </div>
        </div>
        <div
          className=' col-sm-8 px-0 d-none d-sm-block bg-white'
          style={{backgroundImage: `url(${formImage})`, backgroundSize: 'cover', minHeight: '100vh'}}
        ></div>
      </div>
    </div>
  );
};

export default FormsContainer;
