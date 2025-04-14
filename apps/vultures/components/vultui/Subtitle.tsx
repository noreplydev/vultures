import { c } from "@/theme"
import { ReactElement } from "react"

export const Subtitle = ({ children, style }: { children: ReactElement | string, style?: {} }) => {
  return <h2
    style={{
      fontSize: c.md.fontSize,
      fontWeight: "400",
      ...style
    }}
  >{children}</h2>
}