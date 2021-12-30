import { UserIcon } from '@heroicons/react/solid'
import Link from '@/common/Link'

/* <a href="" className="flex items-center px-3 py-2 mt-2 rounded-md">
<i className="w-4 h-4 mr-2" data-feather="video"></i> Famílias
</a> */

type LinksProps = {
  active: boolean
  item: {
    url: string
    title: string
  }
}

export default function Links({ active = false, item }: LinksProps) {
  // const activeClass = !active ? 'text-theme-1' : 'bg-theme-1 text-white'
  return (
    <Link
      to={item.url}
      className={`flex items-center px-3 py-2 my-2 font-medium rounded-md ${
        !active
          ? 'text-gray-700 hover:bg-gray-200 hover:text-gray-800'
          : 'bg-gray-200 text-gray-800'
      }`}
    >
      <UserIcon className="w-4 h-4 mr-2" /> {item.title}
    </Link>
  )
}
