import { colors, configs } from "@/theme"

export const Input = (props: any) => {
  return <input
    style={{
      backgroundColor: colors.backgroundHighlight,
      borderRadius: "5px",
      paddingInline: configs.sm.paddingInline,
      paddingBlock: configs.sm.paddingBlock
    }} {...props} />
}