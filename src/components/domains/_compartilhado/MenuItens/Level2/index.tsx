import * as blocks from '@/blocks'
import { useRouter } from 'next/router'
import { ReactChild, ReactNode, useState } from 'react'

type SubItemProps = {
  subitem: {
    title: string
    url: string
    icon: ReactChild
  }
  children: ReactNode
}

export default function Level2({
  subitem: { title, icon, url },
  children
}: SubItemProps) {
  const router = useRouter()
  const [open, setOpen] = useState(router.asPath.includes(url))
  const active = router.asPath.includes(url)
  return (
    <blocks.MenuItemLevel2
      icon={icon}
      title={title}
      url={url}
      active={active}
      open={open}
      setOpen={setOpen}
    >
      {children}
    </blocks.MenuItemLevel2>
  )
}
