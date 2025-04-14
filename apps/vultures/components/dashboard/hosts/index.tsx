import { atom, useAtom } from "jotai";
import { Hosts } from "./HostsPage";
import { ModalComponentTypes, ModalContainer, ModalProvider, useModal } from "@/components/vultui/Modal";
import { useEffect } from "react";
import { HostsRepository } from "@/repositories/HostsRepository";
import { getApiPrefix } from "@/utils/api";

const HostsAtom = atom<any[] | null>(null)

export const HostsPage = () => {
  const [hosts, setHosts] = useAtom(HostsAtom)

  const refreshHosts = async () => {
    const fetchedHosts = await HostsRepository.getAll(getApiPrefix())
    console.log("result", fetchedHosts)
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
