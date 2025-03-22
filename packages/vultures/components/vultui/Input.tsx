import { c, colors, configs } from "@/theme"

export const Input = ({ style, placeholder, type }: any) => {
  return <input
    style={{
      backgroundColor: colors.backgroundHighlight,
      borderRadius: c.sm.borderRadius,
      paddingInline: c.sm.paddingInline,
      paddingBlock: c.sm.paddingBlock,
      fontSize: c.sm.fontSize,
      ...style
    }} placeholder={placeholder} type={type} />
}