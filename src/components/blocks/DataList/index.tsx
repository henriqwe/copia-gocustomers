import * as common from '@/common'
import { ReactNode } from 'react'

type DataListProps = {
  data: {
    title: string | ReactNode
    value: string | ReactNode
  }[]
}

export default function DataList({ data }: DataListProps) {
  return (
    <div className="overflow-hidden bg-white shadow">
      <div className="border-t">
        <dl>
          {data.map((item, index) => (
            <common.DataListLine
              key={item.title?.toString()}
              title={item.title}
              value={item.value}
              position={index}
            />
          ))}
        </dl>
      </div>
    </div>
  )
}
