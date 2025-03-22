import { colors } from "@/theme/colors"

export const Button = ({ children, onClick }: { onClick: () => void } & any) => {
  return <button
    onClick={onClick}
    style={{
      backgroundColor: colors.secondary
    }}
    className="rounded-md px-5 py-2 cursor-pointer
      transition-all ease-in-out duration-75 active:scale-95"
  >{children}</button>
}