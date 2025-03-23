import { atom, useAtom } from "jotai";
import { Hosts } from "./HostsPage";
import { ModalComponentTypes, ModalContainer, ModalProvider, useModal } from "@/components/vultui/Modal";
import { useEffect } from "react";

const HostsAtom = atom<any[] | null>(null)

const getHosts = async (): Promise<any[] | undefined> => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const fetchResult = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/hosts", {
      method: "get",
    })
    const result = await fetchResult.json()
    if (!result.isError) {
      console.log(result)
      return result.data.entries
    }
  } else {
    throw new Error("No api url provided")
  }
}

export const HostsPage = () => {
  const [hosts, setHosts] = useAtom(HostsAtom)

  const refreshHosts = async () => {
    const fetchedHosts = await getHosts()
    if (fetchedHosts && fetchedHosts.length) {
      setHosts(fetchedHosts)
    }
  }

  useEffect(() => {
    refreshHosts()
  }, [])

  return <ModalProvider>
    <Hosts items={hosts} refresh={refreshHosts} />
  </ModalProvider>
}
