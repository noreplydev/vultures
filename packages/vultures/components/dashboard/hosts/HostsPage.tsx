import { Button } from "@/components/vultui";
import { ModalComponentTypes, ModalContainer, useModal } from "@/components/vultui/Modal";
import { c, colors } from "@/theme"
import { CircleCheck } from "lucide-react";
import { useState } from "react"
import { Loading, UseAnimations } from "@/components/vultui/Icons";
import { Input } from "@/components/vultui/Input";
import { Subtitle } from "@/components/vultui/Subtitle";
import { HostsRepository } from "@/repositories/HostsRepository";
import { getApiPrefix } from "@/utils/api";

const AddHostModal = ({ onCancel, refresh }: ModalComponentTypes & any) => {
  const [hostname, setHostname] = useState("")
  const [creating, setCreating] = useState(false)

  const createHost = async () => {
    const created = await HostsRepository.create(getApiPrefix(), hostname)
    if (!created) {
      throw new Error("Host not created")
    }

    onCancel()
  }

  return <ModalContainer
    style={{
      display: 'flex',
      flexDirection: 'column',
      paddingBlock: c.md.paddingBlock, paddingInline: c.md.paddingInline,
      gap: c.md.gap
    }}
  >
    <Subtitle style={{ color: colors.primary }}>Add host</Subtitle>
    <form
      style={{ gap: c.md.gap }}
      onSubmit={(e) => {
        e.preventDefault()

        setCreating(true)
        createHost()
          .then(() => refresh())
          .then(() => setCreating(false))
      }}
      className="flex flex-row">
      <Input type="text" placeholder="hostname" value={hostname} onChange={(e) => setHostname(e.target.value)} />
      <Button
        className="cursor-pointer"
      >
        {
          creating
            ? <UseAnimations
              strokeColor="white"
              speed={0.7}
              animation={Loading}
            />
            : "create"
        }
      </Button>
    </form>
  </ModalContainer>
}

export const Hosts = ({ items, refresh }: { items: any[] | null, refresh: () => void }) => {
  const { openModal } = useModal()

  const addHost = () => openModal((props) => AddHostModal({ refresh, ...props }))

  return <div className="h-full w-full flex flex-col p-6 gap-5">
    <div className="flex flex-row gap-5">
      <h1 className="text-5xl font-semibold">Hosts</h1>
      <Button onClick={addHost}>
        add
      </Button>
    </div>
    <div className="grid grid-cols-4 gap-3">
      {
        items
          ? items.sort((a, b) => a.value.createdAt - b.value.createdAt).map(host => {
            return <HostCard host={host['value']} />
          })
          : <Subtitle>No hosts</Subtitle>
      }
    </div>
  </div>
}

const HostCard = ({ host }: { host: any }) => {
  return <div
    style={{ backgroundColor: colors.backgroundSecondary }}
    className="h-full w-full flex flex-col px-5 py-3 rounded-sm gap-5"
  >
    <div className="flex flex-col">
      <p className="text-xl font-semibold">{host.hostname}</p>
      <p className="text-md font-extralight">{host.value}</p>
    </div>
    {
      host.verified
        ? <div className="flex flex-row gap-2 justify-start items-center">
          <CircleCheck
            color={colors.primary}
            size={15}
          />
          <p className="text-md font-extralight">verified</p>
        </div>
        : <div className="flex flex-row gap-2">
          <UseAnimations
            strokeColor="white"
            speed={Math.random() * 0.97}
            animation={Loading}
          />
          <p className="text-md font-extralight">awaiting host verification</p>
        </div>
    }
  </div>
}