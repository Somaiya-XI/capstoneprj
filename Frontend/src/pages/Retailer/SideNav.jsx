/** @format */

import {Sparkles, Package, Store, Settings} from 'lucide-react';
import {useCsrfContext} from '@/Contexts';

import Nav from '@/Components/ui/shadcnnav';

export default function SideNavbar({collabsed}) {
  return (
    <div className='relative min-w-[80px] min-h-[100vh] border-r px-3  pb-10 pt-24 '>
      <Nav
        isCollapsed={collabsed}
        links={[
          {
            title: 'Products',
            href: '/retailer-dashboard/my-products',
            icon: Store,
            variant: 'default',
          },
          {
            title: 'Orders',
            href: '/retailer-dashboard/orders',
            icon: Package,
            variant: 'ghost',
          },
          {
            title: 'Settings',
            href: '/retailer-dashboard/settings',
            icon: Settings,
            variant: 'ghost',
          },
          {
            title: 'Go Smart!',
            href: '/retailer-dashboard/smart-dashboard',
            icon: Sparkles,
            variant: 'ghost',
          },
        ]}
      />
    </div>
  );
}
