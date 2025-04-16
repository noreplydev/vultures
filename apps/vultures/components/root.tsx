import Link from "next/link";
import { Button } from "./vultui";

export function Root() {
  return <div className="h-screen w-screen flex  flex-col">
    <main className="flex flex-col flex-1 items-center justify-center gap-5 overflow-hidden">
      <h1
        className="text-8xl font-bold"
      >VULTURES</h1>
      <Link
        href={"/dashboard"}
      >
        <Button>DASHBOARD</Button>
      </Link>
    </main>
    <footer className="flex w-full justify-center items-center p-5">
      <p>CREAT0R</p>
    </footer>
  </div>
}