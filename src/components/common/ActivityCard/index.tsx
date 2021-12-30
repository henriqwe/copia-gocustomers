import { ReactNode } from 'react'

type ActivityCardProps = {
  title: string
  date?: string
  description?: ReactNode
}

export default function ActivityCard({
  title,
  date,
  description
}: ActivityCardProps) {
  // TODO: Refatorar estilo dos before's para não sobrepor a imagem
  return (
    <div className="relative flex items-center mb-3 intro-x">
      <div className="report-timeline__image">
        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
          <img
            src="https://www.shareicon.net/data/512x512/2017/01/06/868320_people_512x512.png"
            alt="avatar"
          />
        </div>
      </div>
      <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
        <div className="flex items-center">
          <div className="font-medium">{title}</div>
          <div className="ml-auto text-xs text-gray-500">{date}</div>
        </div>
        <div className="mt-1 text-gray-600">{description}</div>
      </div>
    </div>
  )
}
