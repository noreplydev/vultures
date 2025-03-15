import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { Computer } from 'lucide-react'
import { DashboardSidebar } from './DashboardSidebar';

export function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([
    {
      text: "HOSTS",
      id: "hosts",
      icon: <Computer strokeWidth={"1px"} />,
    }
  ])

  return <div className='flex flex-row w-full h-full'>
    <DashboardSidebar
      menuItems={items}
      collapsed={collapsed}
    />
  </div>
}