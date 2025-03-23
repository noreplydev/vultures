import { Button } from "@/components/vultui"
import { ModalContainer } from "@/components/vultui/Modal"
import { Subtitle } from "@/components/vultui/Subtitle"
import { HostsRepository } from "@/repositories/HostsRepository"
import { c, colors } from "@/theme"
import { getApiPrefix } from "@/utils/api"

export const HostView = ({ host }: { host: any }) => {
  return <ModalContainer
    style={{
      display: 'flex',
      width: "15vw",
      height: "fit-content",
      flexDirection: 'column',
      paddingBlock: c.md.paddingBlock, paddingInline: c.md.paddingInline,
      gap: c.md.gap,
      border: "solid 1px " + colors.backgroundHighlight,
    }}
  >
    <div className="flex flex-row w-full h-fit justify-between items-center">
      <div className="flex flex-col">
        <Subtitle style={{ color: colors.primary }}>{host.hostname}</Subtitle>
        <Subtitle style={{ color: colors.primarySoft, fontWeight: "200", fontSize: c.sm.fontSize }}
        >{host.ips.address}</Subtitle>
      </div>
      <div className="p-2">
        <Button onClick={() => HostsRepository.scan(getApiPrefix(), host.hostname)}>
          scan
        </Button>
      </div>
    </div>
  </ModalContainer>
}