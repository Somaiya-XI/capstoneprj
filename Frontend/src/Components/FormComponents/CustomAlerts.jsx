import '../../index.css';
import {toast} from 'sonner';

const CustomErrorAlert = ({style, error = 'error'}) => {
  const errorLines = error.split('\n');

  return (
    <section style={{margin: '24px 0 24px 0'}}>
      <div className='relative items-center w-full'>
        <div className='p-2 border-l-4 border-red-500 rounded-r-xl bg-red-50'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='w-5 h-5 text-red-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </div>
            <div className='ml-3'>
              <div className='text-sm text-red-600'>
                {errorLines.map((line, index) => (
                  <p key={index} className='mt-1 mb-1'>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomErrorAlert;

export function CustomSuccessToast({msg, dur = 3000, colorClass = 'bg-green-50', shiftStart = 'ms-16'}) {
  toast(msg, {
    unstyled: true,
    duration: dur,
    icon: (
      <Iconify-icon
        className='inline'
        icon='line-md:circle-to-confirm-circle-twotone-transition'
        width='24'
        height='24'
        begin='0.8s'
        dur='0.6'
        style={{color: ' #008040'}}
      />
    ),
    position: 'top-left',
    classNames: {
      toast: `rounded-lg p-2.5 flex items-center w-full ${colorClass} ${shiftStart}`,
      title: 'text-muted text-sm ml-2',
    },
  });
}
