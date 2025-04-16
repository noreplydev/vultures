import { colors } from "@/theme"

export const BorderedContainer = ({ children, props }: any) => {
  return <div style={{ borderColor: colors.primary }} className="px-3 py-2.5 border-[1px] " {...props}>
    {children}
  </div>
}