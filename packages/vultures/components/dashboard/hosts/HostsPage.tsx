import { Button } from "@/components/vultui";
import { ModalComponentTypes, ModalContainer, useModal } from "@/components/vultui/Modal";
import { c, colors } from "@/theme"
import { CircleCheck, Trash2 } from "lucide-react";
import { useState } from "react"
import { Loading, Trash, UseAnimations } from "@/components/vultui/Icons";
import { Input } from "@/components/vultui/Input";
import { Subtitle } from "@/components/vultui/Subtitle";
import { HostsRepository } from "@/repositories/HostsRepository";
import { getApiPrefix } from "@/utils/api";
import { HostView } from "./Host";

const DOMAIN_REGEX = /^(?=.{1,253}$)(?:(?!-)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2,})$/;

const AddHostModal = ({ onCancel, refresh }: ModalComponentTypes & any) => {
  const [hostname, setHostname] = useState("")
  const [creating, setCreating] = useState(false)

  const createHost = async () => {
    if (!DOMAIN_REGEX.test(hostname)) {
      return
    }
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

const HostCard = ({ host, refresh }: { host: any, refresh: () => void }) => {
  const { openModal } = useModal()
  return <div
    style={{ backgroundColor: colors.backgroundSecondary }}
    onMouseEnter={(e) => e.currentTarget.style.border = "1px solid " + colors.backgroundHighlight}
    onMouseLeave={(e) => e.currentTarget.style.border = "1px solid transparent"}
    className="h-full w-full flex flex-col px-3 py-3 rounded-sm gap-5 cursor-pointer"
    onClick={() => openModal(() => HostView({ host }))}
  >
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4">
        <p className="text-xl font-semibold">{host.hostname}</p>
        <button
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundHighlight}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          style={{
            borderRadius: c.sm.borderRadius
          }}
          className={"grid place-items-center p-2 cursor-pointer"}
          onClick={async (e) => {
            e.stopPropagation()
            await HostsRepository.delete(getApiPrefix(), host.hostname).then(() => refresh())
          }}
        >
          <Trash2
            className="text-gray-600"
            size={15}
          />
        </button>
      </div>
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
          <p className="text-md font-extralight">verifying</p>
        </div>
    }
  </div>
}

export const Hosts = ({ items, refresh }: { items: any[] | null, refresh: () => void }) => {
  const { openModal } = useModal()

  const addHost = () => openModal((props) => AddHostModal({ refresh, ...props }))

  return <div className="h-full w-full flex flex-col py-12 px-[10vw] gap-5">
    <div className="flex flex-row gap-5">
      <h1 className="text-5xl font-semibold">Hosts</h1>
      <Button onClick={addHost}>
        add
      </Button>
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
      {
        items
          ? items.sort((a, b) => a.value.createdAt - b.value.createdAt).map(host => {
            return <HostCard key={host.key} host={host['value']} refresh={refresh} />
          })
          : <Subtitle>No hosts</Subtitle>
      }
    </div>
  </div>
}