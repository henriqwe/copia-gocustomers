import router from 'next/router'
import * as icons from '@/common/Icons'

export type AcoesProps = {
  active: boolean

  item: any
}

export default function Acoes({ active = false, item }: AcoesProps) {
  return (
    <button
      onClick={() => {
        if (item.url) {
          router.push(item.url)
          return
        }
        item.handler()
      }}
      className={`flex items-center px-3 py-2 transition rounded-md bg-theme-9 bg-opacity-70 hover:bg-theme-9 hover:opacity-100 w-full ${
        !active ? '' : ''
      }`}
    >
      <icons.AddIcon className="w-5 h-5 mr-2" />
      {item.title}
    </button>
  )
}
