import { ReactNode } from 'react'

type ListCardProps = {
  title: string | number
  icon?: ReactNode
  description?: ReactNode
}

export default function ListCard({ title, icon, description }: ListCardProps) {
  // TODO: Refatorar estilo dos before's para não sobrepor a imagem
  return (
    <div className="relative flex items-center mb-3 intro-x">
      <div className="report-timeline__image">
        <div
          className={`flex flex-none justify-center items-center  w-10 h-10 overflow-hidden rounded-full image-fit bg-gray-300 dark:bg-dark-2`}
        >
          {icon}
        </div>
      </div>
      <div className="flex-1 px-5 py-3 ml-4 box bg-gray-300 dark:bg-dark-2 zoom-in">
        <div className="flex items-center">
          <div className="font-medium">{title}</div>
        </div>
        <div className="mt-1 text-gray-600">{description}</div>
      </div>
    </div>
  )
}
