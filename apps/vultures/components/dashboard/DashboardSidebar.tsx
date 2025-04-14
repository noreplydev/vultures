import { colors } from "@/theme"
import { Sidebar } from "../Sidebar"

export const DashboardSidebar = ({ menuItems, collapsed, onCollapse, onExpand }
  : { menuItems: any[], collapsed: boolean, onCollapse?: () => void, onExpand?: () => void }) => {
  return <div
    className="relative flex flex-col w-1/6 h-full
      justify-center items-center p-7 gap-6"
    style={{ backgroundColor: colors.backgroundSecondary }}
  >
    <h2 className="font-bold text-4xl w-fit h-fit">VULTURES</h2>
    <Sidebar
      collapsed={collapsed}
      items={menuItems}
      width={"100%"}
      onCollapse={() => onCollapse && onCollapse()}
      onExpand={() => onExpand && onExpand()}
    />
  </div>
}