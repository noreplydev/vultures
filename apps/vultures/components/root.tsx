import Link from "next/link";
import { Button } from "./vultui";
import { ImgAscii } from "./ImgAscii";

export function Root() {
  return <div className="h-screen w-screen flex  flex-col">
    <main className="flex flex-col flex-1 items-center justify-center gap-5 overflow-hidden
      z-10">
      <h1
        className="text-8xl font-bold"
      >VULTURES</h1>
      <Link
        href={"/dashboard"}
      >
        <Button translucent>DASHBOARD</Button>
      </Link>
    </main>
    <div className="fixed h-screen w-screen flex flex-col justify-center items-center z-0">
      <ImgAscii />
    </div>
    <footer className="flex w-full justify-center items-center p-5 z-10">
      <p>CREAT0R</p>
    </footer>
  </div>
}