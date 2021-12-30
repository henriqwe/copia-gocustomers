import * as blocks from '@/blocks'
import { useRouter } from 'next/router'

type SubItemProps = {
  item3: {
    title: string
    url: string
    icon: React.ReactChild
  }
}

export default function Level3({ item3: { title, icon, url } }: SubItemProps) {
  const router = useRouter()
  const active = router.asPath.includes(url)

  return (
    <blocks.MenuItemLevel3
      icon={icon}
      title={title}
      url={url}
      active={active}
    />
  )
}
