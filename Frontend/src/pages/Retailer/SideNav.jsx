/** @format */

import {LayoutDashboard, Package, Store, Settings} from 'lucide-react';

import Nav from '@/Components/ui/shadcnnav';

export default function SideNavbar({collabsed}) {
  return (
    <div className='relative min-w-[80px] min-h-[100vh] border-r px-3  pb-10 pt-24 '>
      <Nav
        isCollapsed={collabsed}
        links={[
          {
            title: 'Dashboard',
            href: '/retailer-dashboard',
            icon: LayoutDashboard,
            variant: 'default',
          },
          {
            title: 'My Products',
            href: '/retailer-dashboard/my-products/',
            icon: Store,
            variant: 'ghost',
          },
          {
            title: 'Ordrs',
            href: '/retailer-dashboard',
            icon: Package,
            variant: 'ghost',
          },
          {
            title: 'Settings',
            href: '/retailer-dashboard',
            icon: Settings,
            variant: 'ghost',
          },
        ]}
      />
    </div>
  );
}
