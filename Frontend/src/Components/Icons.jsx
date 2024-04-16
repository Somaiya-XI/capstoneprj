// icon:trash-x | Tabler Icons https://tablericons.com/ | Csaba Kissi
import * as React from 'react';

export function UiwRegister({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <g fill='none' stroke='currentColor' strokeWidth='1.5'>
        <circle cx='10' cy='6' r='4' />
        <path
          strokeLinecap='round'
          d='M21 10h-2m0 0h-2m2 0V8m0 2v2m-1.002 6c.002-.164.002-.331.002-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S2 22 10 22c2.231 0 3.84-.157 5-.437'
        />
      </g>
    </svg>
  );
}
export function UiwLogin({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 20 20' {...props}>
      <path
        fill='currentColor'
        d='M9.76 0C15.417 0 20 4.477 20 10S15.416 20 9.76 20c-3.191 0-6.142-1.437-8.07-3.846a.644.644 0 0 1 .115-.918a.68.68 0 0 1 .94.113a8.96 8.96 0 0 0 7.016 3.343c4.915 0 8.9-3.892 8.9-8.692c0-4.8-3.985-8.692-8.9-8.692a8.961 8.961 0 0 0-6.944 3.255a.68.68 0 0 1-.942.101a.644.644 0 0 1-.103-.92C3.703 1.394 6.615 0 9.761 0m.545 6.862l2.707 2.707c.262.262.267.68.011.936L10.38 13.15a.662.662 0 0 1-.937-.011a.662.662 0 0 1-.01-.937l1.547-1.548l-10.31.001A.662.662 0 0 1 0 10c0-.361.3-.654.67-.654h10.268L9.38 7.787a.662.662 0 0 1-.01-.937a.662.662 0 0 1 .935.011'
      ></path>
    </svg>
  );
}
export function UiForgotPassword({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 2 24 24' {...props}>
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.35}>
        <path d='M15 21H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h10c.265 0 .518.052.75.145'></path>
        <path d='M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4m3 11v.01M19 19a2.003 2.003 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483'></path>
      </g>
    </svg>
  );
}
export function UiResetPassword({width = '1.2em', height = '1.2em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 1 24 24' {...props}>
      <path
        fill='currentColor'
        d='M5.5 12.077q0 1.522.643 2.804q.644 1.282 2.28 2.723v-2.527q0-.213.144-.356t.357-.144q.213 0 .356.144q.143.143.143.356v3.461q0 .344-.232.576q-.232.232-.576.232H5.154q-.213 0-.356-.144q-.144-.144-.144-.357q0-.212.144-.356q.143-.143.356-.143h2.59q-1.794-1.561-2.519-3.073Q4.5 13.762 4.5 12.07q0-2.208 1.148-4.022q1.148-1.813 3.008-2.756q.196-.104.4-.034q.206.069.273.277q.067.207-.021.4q-.089.193-.28.296q-1.591.813-2.56 2.383q-.968 1.57-.968 3.463m13.501-.039q-.214 0-.358-.143q-.143-.143-.16-.357q-.08-1.398-.74-2.587q-.66-1.19-2.166-2.536v2.508q0 .213-.144.356t-.357.144q-.213 0-.356-.144q-.143-.143-.143-.356V5.462q0-.344.232-.576q.232-.232.576-.232h3.461q.213 0 .356.144q.144.144.144.357q0 .212-.144.356q-.143.143-.356.143h-2.59q1.75 1.49 2.449 2.984q.699 1.493.778 2.9q.011.214-.128.357t-.354.143m-2.847 9.693q-.367 0-.645-.278t-.278-.645v-2.693q0-.367.278-.645t.645-.278h.096v-1q0-.748.51-1.258t1.26-.51q.747 0 1.258.51q.51.51.51 1.258v1h.097q.376 0 .63.278t.254.645v2.693q0 .367-.278.645t-.645.278zm.865-4.539h2v-1q0-.425-.287-.712t-.713-.288q-.425 0-.712.288t-.288.712z'
      ></path>
    </svg>
  );
}
// <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
//   <path
//     fill='currentColor'
//     d='M12.998 20q-1.4 0-2.704-.475q-1.305-.474-2.377-1.329q-.175-.14-.188-.35q-.014-.211.152-.377q.165-.165.385-.156q.22.01.397.164q.933.727 2.01 1.125Q11.747 19 13 19q2.92 0 4.96-2.04T20 12q0-2.9-2.05-4.95T13 5q-2.9 0-4.95 2.05T6 12v1.387l1.817-1.818q.136-.14.34-.14t.349.14q.165.146.156.357q-.01.21-.156.357l-2.44 2.44q-.243.242-.566.242q-.323 0-.565-.242l-2.447-2.446q-.146-.146-.152-.357q-.007-.21.149-.35q.155-.141.366-.134q.21.006.35.152L5 13.412V12q0-1.665.626-3.119q.626-1.454 1.713-2.542q1.088-1.087 2.542-1.713Q11.334 4 12.999 4q1.664 0 3.12.626q1.454.626 2.542 1.713q1.087 1.088 1.713 2.541q.626 1.454.626 3.118q0 3.329-2.334 5.665Q16.332 20 12.998 20M11 15.77q-.376 0-.63-.255q-.255-.254-.255-.63v-3q0-.376.288-.63t.712-.255V9.885q0-.778.554-1.331Q12.223 8 13 8q.777 0 1.331.554q.554.553.554 1.33V11q.425 0 .712.254t.288.63v3q0 .377-.255.63q-.254.255-.63.255zm.885-4.77h2.23V9.892q0-.47-.326-.797q-.326-.326-.789-.326t-.79.326q-.325.326-.325.797z'
//   ></path>
// </svg>

export function PasswordIcon({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <g fill='none' stroke='currentColor' strokeWidth={0.8}>
        <path
          strokeLinecap='round'
          d='M12 10v4m-1.732-3l3.464 2m0-2l-3.465 2m-3.535-3v4M5 11l3.464 2m0-2L5 13m12.268-3v4m-1.732-3L19 13m0-2l-3.465 2'
        ></path>
      </g>
    </svg>
  );
}
export function PasswordIcon1({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 256 256' {...props}>
      <path
        fill='currentColor'
        d='M48 56v144a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0m84 54.5l-20 6.5V96a8 8 0 0 0-16 0v21l-20-6.5a8 8 0 0 0-5 15.22l20 6.49l-12.34 17a8 8 0 1 0 12.94 9.4l12.34-17l12.34 17a8 8 0 1 0 12.94-9.4l-12.34-17l20-6.49A8 8 0 0 0 132 110.5m106 5.14a8 8 0 0 0-10-5.14l-20 6.5V96a8 8 0 0 0-16 0v21l-20-6.49a8 8 0 0 0-4.95 15.22l20 6.49l-12.34 17a8 8 0 1 0 12.94 9.4l12.34-17l12.34 17a8 8 0 1 0 12.94-9.4l-12.34-17l20-6.49a8 8 0 0 0 5.07-10.09'
      ></path>
    </svg>
  );
}
export function EmailIcon({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <g fill='none' stroke='currentColor' strokeWidth={1.5}>
        <path d='M2 12c0-3.771 0-5.657 1.172-6.828C4.343 4 6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172C22 6.343 22 8.229 22 12c0 3.771 0 5.657-1.172 6.828C19.657 20 17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172C2 17.657 2 15.771 2 12Z'></path>
        <path
          strokeLinecap='round'
          d='m6 8l2.159 1.8c1.837 1.53 2.755 2.295 3.841 2.295c1.086 0 2.005-.765 3.841-2.296L18 8'
        ></path>
      </g>
    </svg>
  );
}
export function UploadFileIcon({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <g>
        <path
          fill='#212529'
          fillRule='evenodd'
          d='M12 1.25a.75.75 0 0 1 .57.262l3 3.5a.75.75 0 1 1-1.14.976l-1.68-1.96V15a.75.75 0 0 1-1.5 0V4.027L9.57 5.988a.75.75 0 1 1-1.14-.976l3-3.5A.75.75 0 0 1 12 1.25M6.996 8.252a.75.75 0 0 1 .008 1.5c-1.093.006-1.868.034-2.457.142c-.566.105-.895.272-1.138.515c-.277.277-.457.666-.556 1.4c-.101.755-.103 1.756-.103 3.191v1c0 1.436.002 2.437.103 3.192c.099.734.28 1.122.556 1.4c.277.276.665.456 1.4.555c.754.102 1.756.103 3.191.103h8c1.435 0 2.436-.001 3.192-.103c.734-.099 1.122-.279 1.399-.556c.277-.277.457-.665.556-1.399c.101-.755.103-1.756.103-3.192v-1c0-1.435-.002-2.436-.103-3.192c-.099-.733-.28-1.122-.556-1.399c-.244-.243-.572-.41-1.138-.515c-.589-.108-1.364-.136-2.457-.142a.75.75 0 1 1 .008-1.5c1.082.006 1.983.032 2.72.167c.758.14 1.403.405 1.928.93c.602.601.86 1.36.982 2.26c.116.866.116 1.969.116 3.336v1.11c0 1.368 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26c-.602.602-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116c-.9-.121-1.658-.38-2.26-.982c-.602-.602-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337v-1.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.525-.524 1.17-.79 1.928-.929c.737-.135 1.638-.161 2.72-.167'
          clipRule='evenodd'
        />
      </g>
    </svg>
  );
}

export function CompIcon({width = '1em', height = '1em', num, ...props}) {
  if (num == 1) {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
        <g fill='none' stroke='currentColor' strokeLinecap='round' strokeWidth={1.2}>
          <path d='M15 4.001c3.114.01 4.765.108 5.828 1.17C22 6.344 22 8.23 22 12s0 5.657-1.172 6.828C19.657 20 17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172C2 17.658 2 15.771 2 12c0-3.771 0-5.657 1.172-6.828C4.235 4.109 5.886 4.01 9 4'></path>
          <path d='M12 5V3m-4 7.5h8M8 14h5.5'></path>
        </g>
      </svg>
    );
  }
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <g fill='none' stroke='currentColor' strokeWidth={0.8}>
        <circle cx='9' cy='9' r='2' />
        <path d='M13 15c0 1.105 0 2-4 2s-4-.895-4-2s1.79-2 4-2s4 .895 4 2Z' />

        <path strokeLinecap='round' d='M19 12h-4m4-3h-5' />
        <path strokeLinecap='round' d='M19 15h-3' opacity='1' />
      </g>
    </svg>
  );
}

export function AddressIcon({width = '1em', height = '1em', num, ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <g fill='none'>
        <path
          stroke='currentColor'
          strokeWidth={1.4}
          d='M2 5.257C2 3.458 3.567 2 5.5 2S9 3.458 9 5.257C9 7.042 7.883 9.125 6.14 9.87a1.638 1.638 0 0 1-1.28 0C3.117 9.125 2 7.042 2 5.257Zm13 12C15 15.458 16.567 14 18.5 14s3.5 1.458 3.5 3.257c0 1.785-1.117 3.868-2.86 4.613a1.638 1.638 0 0 1-1.28 0c-1.743-.745-2.86-2.828-2.86-4.613Z'
        ></path>
        <path
          fill='currentColor'
          d='M12 4.25a.75.75 0 0 0 0 1.5zM12 19l.53.53a.75.75 0 0 0 0-1.06zm5.206-10.313l.402.633zM6.794 15.313l.403.632zm4.236 1.657a.75.75 0 0 0-1.06 1.06zm-1.06 3a.75.75 0 1 0 1.06 1.06zm6.162-15.72H12v1.5h4.132zM12 18.25H7.868v1.5H12zm4.803-10.195L6.392 14.68l.805 1.265L17.608 9.32zM12.53 18.47l-1.5-1.5l-1.06 1.06l1.5 1.5zm-1.06 0l-1.5 1.5l1.06 1.06l1.5-1.5zm-3.602-.22c-1.25 0-1.726-1.633-.671-2.305l-.805-1.265c-2.321 1.477-1.275 5.07 1.476 5.07zm8.264-12.5c1.25 0 1.726 1.633.671 2.305l.805 1.265c2.321-1.477 1.275-5.07-1.476-5.07z'
          opacity={0.3}
        ></path>
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.4}
          d='M18.5 17.5h.009M5.49 5.5h.01'
        ></path>
      </g>
    </svg>
  );
}

export function SimpleLogo({width = '1em', height = '1em', ...props}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id='sm-logo'
      width={width}
      height={height}
      viewBox='0 0 513.1 353.9'
      {...props}
    >
      <g>
        <path
          d='m513.1,0l-86.9,353.9h-121l-48.7-216.9-49.7,216.9h-121L0,0h106.4l41.2,242L203.3,0h107.9l54.2,240L406.7,0h106.4Z'
          fill='#023c07'
        />
      </g>
    </svg>
  );
}

export function HardwareIcon({width = '1em', height = '1em', ...props}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1}
        d='M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25m.75-12h9v9h-9z'
      ></path>
    </svg>
  );
}
