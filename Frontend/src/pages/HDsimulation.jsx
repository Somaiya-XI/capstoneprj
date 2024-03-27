import axios from 'axios';
import {useCsrfContext, useUserContext} from '../Contexts';
import {useEffect, useState} from 'react';
import {API} from '../backend';
import {toast} from 'sonner';
import '../index.css';
const HardwareTest = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(23 23 23)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
      <div className='content text-light' style={{textAlign: 'center'}}>
        <h2>Simulating Shelf Readings</h2>
        <div className='mt-4'>
          <button className='btn bg-amber-50 mr-2 bg-light'>Add to shelf 1</button>
          <button className='btn bg-indigo-100 mr-2 bg-light'>Remove from shelf 1</button>
          <button className='btn bg-rose-50 mr-2 bg-light'>Add product for 1st time</button>
          <button className='btn bg-rose-50 mr-2 bg-light'>Add multiple products</button>
          <button className='btn bg-amber-50 mr-2 bg-light'>Add to shelf 2</button>
          <button className='btn bg-indigo-100 mr-2 bg-light'>Remove from shelf 2</button>
        </div>
      </div>
    </div>
  );
};

export default HardwareTest;

export function toastError() {
  return toast.error('Server Error! Your not authenticated', {
    duration: 1500,
    position: 'bottom-left',
    style: {background: 'rgb(254 242 242)'},
    className: 'text-dark',
    icon: (
      <Iconify-icon
        className='inline'
        icon='line-md:alert-circle-twotone'
        width='24'
        height='24'
        begin='0s'
        dur='0.6'
        style={{color: ' rgb(127, 29, 29)'}}
      />
    ),
  });
}
