// icon:trash-x | Tabler Icons https://tablericons.com/ | Csaba Kissi
import * as React from 'react';

function BinIcon(props) {
  return (
    <svg
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      viewBox='0 0 24 24'
      height='1em'
      width='1em'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' />
      <path d='M4 7h16M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M10 12l4 4m0-4l-4 4' />
    </svg>
  );
}

export default BinIcon;
