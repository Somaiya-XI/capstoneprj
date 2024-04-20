import React, {useState} from 'react';
import styled from 'styled-components';
import {EmailIcon, PasswordIcon, UploadFileIcon} from '../Icons.jsx';
import '../../pages/Account/form.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import {fileToBase64} from '../../Helpers/Base64Converter.jsx';

const IconedInput = ({
  icon: IconComponent,
  placeholder,
  type = 'text',
  className = '',
  fontSize = '30px',
  label,
  htmlFor,
  onChange,
  value,
  ...props
}) => {
  if (type.toLocaleLowerCase() !== 'textarea') {
    return (
      <div className='form-group'>
        {label ? <label htmlFor={htmlFor}></label> : <p className='mt-6'></p>}
        <CustomeInput>
          <IconComponent fontSize={fontSize} style={{marginLeft: '1rem', position: 'absolute'}}></IconComponent>
          <input
            className={className}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{padding: '1rem 1rem 1rem 3.2rem', width: '100%'}}
            {...props}
          ></input>
        </CustomeInput>
      </div>
    );
  }
  return (
    <div className='form-group'>
      {label ? <label htmlFor={htmlFor}></label> : <p className='mt-6'></p>}
      <CustomeInput>
        <IconComponent
          fontSize={fontSize}
          style={{marginLeft: '1rem', marginBottom: '3.2rem', position: 'absolute'}}
        ></IconComponent>
        <textarea
          rows='4'
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{padding: '1rem 1rem 1rem 3.2rem', width: '100%', resize: 'none'}}
          {...props}
        ></textarea>
      </CustomeInput>
    </div>
  );
};

const CustomeInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export default IconedInput;

export const PasswordFeild = ({
  icon = PasswordIcon,
  placeholder = 'enter your password',
  onChange,
  value,
  fontSize = '34px',
  ...props
}) => {
  return (
    <IconedInput
      type='password'
      className='form-control'
      placeholder={placeholder}
      icon={icon}
      fontSize={fontSize}
      onChange={onChange}
      value={value}
      required
      autoFocus
      {...props}
    />
  );
};

export const EmailFeild = ({placeholder = 'enter your email', onChange, value, required, autoFocus, ...props}) => {
  return (
    <IconedInput
      className='form-control'
      placeholder={placeholder}
      icon={EmailIcon}
      fontSize='24px'
      onChange={onChange}
      value={value}
      required
      autoFocus
      {...props}
    />
  );
};

export const ImageField = ({text = 'upload file ~', dispatch = null, ...props}) => {
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const file64 = await fileToBase64(file);
    if (dispatch) {
      dispatch({
        type: 'input',
        field: 'commercial_reg',
        value: file64,
      });
      // if (file) {
      //   reader.readAsDataURL(file);
      // }
    }
    setFileName(file.name);
  };

  return (
    <label
      className='flex items-center px-3 py-3 my-6 text-center bg-white border-2 border-dashed rounded-lg cursor-pointer'
      {...props}
    >
      <UploadFileIcon fontSize='20px' style={{position: 'absolute'}} />

      <span className='fw-normal' style={{paddingLeft: '2.2rem', fontSize: '12px'}}>
        {fileName ? fileName : text}
      </span>

      <input type='file' className='hidden' onChange={handleFileUpload} />
    </label>
  );
};
export const PhoneField = ({onChange, value, ...props}) => {
  return (
    <div className='form-group'>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <p className='mt-6'></p>
        <PhoneInput
          country={'sa'}
          preferredCountries={['sa', 'ae', 'bh', 'kw', 'qa', 'om', 'eg']}
          onlyCountries={[
            'ae',
            'bh',
            'dz',
            'eg',
            'jo',
            'kw',
            'lb',
            'ly',
            'ma',
            'om',
            'qa',
            'sa',
            'tn',
            'ye',
            'af',
            'pk',
            'ps',
            'sy',
            'sd',
            'iq',
          ]}
          value={value}
          onChange={onChange}
          inputStyle={{
            border: '0.2em solid #e8e8e8',
            borderRadius: '8px',
            minHeight: '55px',
            fontSize: '12px',
            fontWeight: 'normal',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
};

export const FormCheck = ({text = 'choose', value, checked, onChange, ...props}) => {
  return (
    <div className='form-check mt-3'>
      <input
        id='flexRadioDefault'
        className='form-check-input'
        type='radio'
        value={value}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span className='text-sm fw-normal text-muted' htmlFor='flexRadioDefault'>
        {text}
      </span>
    </div>
  );
};
export const FormButton = ({text = 'Submit', type = 'submit'}) => {
  return (
    <div className='form-group'>
      <button className='btn btn-block login-btn' type={type}>
        {text}
      </button>
    </div>
  );
};
