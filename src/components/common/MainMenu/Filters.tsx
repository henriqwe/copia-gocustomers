import { useEffect, useState } from 'react'

type FiltrosProps = {
  item: {
    url?: string
    handler?: () => any
    title: string
  }
  disabledAll: boolean
}

export default function Filters({ item, disabledAll }: FiltrosProps) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(false)
  }, [disabledAll])
  return (
    <div
      className="flex items-center px-3 py-2 rounded-md cursor-pointer"
      onClick={() => {
        item.handler && item.handler()
        setActive(true)
      }}
    >
      <div
        className={`w-2 h-2 mr-3 rounded-full ${
          active ? 'bg-theme-9' : 'bg-theme-11'
        }`}
      />
      {item.title}
    </div>
  )
}
