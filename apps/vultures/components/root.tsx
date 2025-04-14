import Link from "next/link";

export function Root() {
  return <div className="h-screen w-screen flex  flex-col font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col flex-1 items-center justify-center gap-5">
      <h1
        className="text-8xl font-bold"
      >VULTURES</h1>
      <Link
        href={"/dashboard"}
        className="border border-solid border-white px-4 py-2
        text-xs hover:bg-white hover:text-black"
      >
        DASHBOARD
      </Link>
    </main>
    <footer className="flex w-full justify-center items-center p-5">
      <code>CREAT0R</code>
    </footer>
  </div>
}