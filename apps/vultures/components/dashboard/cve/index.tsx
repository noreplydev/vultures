import { BorderedContainer } from "@/components/vultui/BorderedContainer"
import { Subtitle } from "@/components/vultui/Subtitle"
import { useEffect, useState } from "react"

export const CvesPage = () => {
  const [cves, setCves] = useState([])
  useEffect(() => {
    const fetchCves = async () => {
      const response = await fetch("/api/v0/cve?order=desc&page=0")
      const data = await response.json()
      setCves(data.data.entries)
    }

    fetchCves()
  }, [])

  return <div className='flex flex-col w-full h-full justify-start items-start'>
    <main className="flex flex-col w-full h-full px-10 py-12 lg:px-44 justify-start items-center overflow-y-scroll overflow-x-hidden">
      <BorderedContainer>
        <Subtitle>CVE DATABASE</Subtitle>
      </BorderedContainer>
      <p className="bg-white text-black px-2 w-full text-center">LAST 100</p>
      <div className="flex flex-col gap-3 w-full">
        {
          cves.map((cve: any) => {
            const publishDate = new Date(Date.parse(cve.value.published))
            return <BorderedContainer>
              <div className="w-full h-fit flex flex-col gap-3">
                <div className="flex flex-row h-fit w-full gap-2 justify-between">
                  <p className="bg-white text-black px-2 w-fit">{cve.key}</p>
                  <div className="h-6 w-fit">{publishDate.getDay() + "/" + publishDate.getMonth() + "/" + publishDate.getFullYear()}</div>
                </div>
                <p className="whitespace-normal break-words">{cve.value.descriptions[0].value}</p>
                <p className="bg-white text-black px-2 w-fit">{cve.value.sourceIdentifier}</p>
              </div>
            </BorderedContainer>
          })
        }
      </div>
    </main>
  </div>
}

export const serverside = async () => {

}