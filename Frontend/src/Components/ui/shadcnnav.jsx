/** @format */

import {cn} from '@/lib/utils';
import {buttonVariants} from '@/Components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/Components/ui/tooltip';
import {TooltipProvider} from '@radix-ui/react-tooltip';
import {Link} from 'react-router-dom';
import '../../pages/Retailer/retailer.css';

function Nav({links, isCollapsed}) {
  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 retailer-link'
      >
        <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={link.href}
                    className={cn(
                      buttonVariants({
                        variant: link.variant === 'default' ? 'default' : 'ghost',
                        size: 'icon',
                      }),
                      'h-9 w-9',
                      link.variant === 'default'
                    )}
                  >
                    <link.icon className='h-4 w-4' />
                    <span className='sr-only'>{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right' className='flex items-center gap-4 bg-[#667d68] text-white '>
                  {link.title}
                  {link.label && <span className='ml-auto '>{link.label}</span>}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={index}
                to={link.href}
                className={cn(
                  buttonVariants({
                    variant: link.variant === 'default' ? 'default' : 'ghost',
                    size: 'sm',
                  }),
                  link.variant === 'default' &&
                    'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                  'justify-start'
                )}
              >
                <link.icon className='mr-2 h-4 w-4' />
                {link.title}
                {link.label && (
                  <span className={cn('ml-auto', link.variant === 'default' && 'text-background dark:text-white')}>
                    {link.label}
                  </span>
                )}
              </Link>
            )
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}

export default Nav;
