import { colors } from '@/theme/colors';
import React from 'react';
import { Sidebar as LibSidebar, Menu, MenuItem } from 'react-pro-sidebar';

export function SidebarItem({ item }: { item: any }) {
  // handle collapsable sections
  if (item?.children) {
    return <div className='w-full h-fit bg-red-500'>
      <div className='flex flex-row gap-3'>
        {item.icon}
        <p>{item.text}</p>
      </div>
      <div className='pl-5'>
        {
          item.children.map((it: any) => <SidebarItem item={it} />)
        }
      </div>
    </div>
  }

  return <div
    className='flex flex-row w-full h-fit px-4 py-2 rounded-sm gap-3
      justify-start items-center ease-in-out transition-all duration-75 cursor-pointer'
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundHighlight}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.backgroundSecondary}
  >
    {item.icon}
    <p style={{ fontSize: "20px", fontWeight: "lighter", ...item?.style }}>{item.text}</p>
  </div>
}
export function Sidebar({ collapsed, items, width, onCollapse, onExpand }:
  { collapsed: boolean, items: any, width?: any, onCollapse: () => void, onExpand: () => void }) {
  return <div style={{ position: 'relative', display: 'flex', height: "100%", width: "100%" }}>
    <LibSidebar
      collapsed={collapsed}
      style={{ border: 'none' }}
      rootStyles={{ width: width ?? "230px", minWidth: width ?? "230px", height: "100%" }}
    >
      <Menu
        style={{
          backgroundColor: colors.backgroundSecondary,
          width: width
        }}
        className={"h-full p-2"}
      >
        {
          items.map((item: any) => <SidebarItem item={item} key={item.id} />)
        }
      </Menu>
    </LibSidebar>
    {/*
      <button
      className="absolute"
      style={{ left: collapsed ? "100px" : "520px" }}
      onClick={collapsed ? () => onExpand() : () => onCollapse()}>
      Collapse
    </button>
    */}
  </div >
}