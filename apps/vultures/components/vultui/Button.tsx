import { c, colors } from "@/theme"

export const Button = ({ children, onClick, translucent }: { onClick: () => void } & any) => {
  return <button
    onClick={onClick}
    style={{
      backgroundColor: translucent ? colors.background + "81" : colors.background,
      fontSize: c.sm.fontSize,
      borderColor: colors.primary,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = colors.background }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.background; e.currentTarget.style.color = colors.primary }}
    className="px-5 py-2 cursor-pointer border-[1px]
      transition-all ease-in-out duration-75"
  >{children}</button>
}


export const SecondaryButton = ({ children, onClick }: { onClick: () => void } & any) => {
  return <button
    onClick={onClick}
    style={{
      backgroundColor: colors.secondary,
      fontSize: c.sm.fontSize,
    }}
    className="rounded-md px-5 py-2 cursor-pointer
      transition-all ease-in-out duration-75 active:scale-95"
  >{children}</button>
}