import { Hosts } from "./hosts"

export const Page = ({ name }: { name: String }) => {
  if (name === "hosts") {
    return <Hosts />
  }

  return <div className="h-full w-full flex 
    flex-col justify-center items-center gap-3">
    <h1 className="text-7xl font-bold">404</h1>
    <h3 className="text-3xl font-light">Page not found</h3>
  </div>
}