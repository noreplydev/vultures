import { useEffect, useState } from 'react';
import { Computer } from 'lucide-react'
import { DashboardSidebar } from './DashboardSidebar';
import { useRouter } from 'next/router';
import { Page } from './Page';

export function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState<string>("hosts")
  const router = useRouter()
  const items = [
    {
      text: "HOSTS",
      id: "hosts",
      icon: <Computer strokeWidth={"1px"} />,
    }
  ]

  useEffect(() => {
    if (router.query?.page) {
      setPage(String(router.query.page))
    }
  }, [router.query])

  return <div className='flex flex-row w-full h-full'>
    <DashboardSidebar
      menuItems={items}
      collapsed={collapsed}
    />
    <Page name={page} />
  </div>
}