import { colors } from "@/theme/colors"
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react"
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading'

export const Hosts = () => {
  const [hosts, setHosts] = useState([])

  useEffect(() => {
    const getHosts = async () => {
      if (process.env.NEXT_PUBLIC_API_URL) {
        const fetchResult = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/hosts", {
          method: "get",
        })
        const result = await fetchResult.json()
        if (!result.isError) {
          console.log(result)
          setHosts(result.data.entries)
        }
      }
    }

    getHosts()
  }, [])

  return <div className="h-full w-full flex flex-col">
    <div className="grid grid-cols-4 p-5 gap-3">
      {
        hosts.length && hosts.map(host => {
          return <HostCard host={host['value']} />
        })
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
            speed={0.7}
            animation={loading}
          />
          <p className="text-md font-extralight">awaiting host verification</p>
        </div>
    }
  </div>
}