import { SearchIcon } from '@heroicons/react/outline'

const ViewIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <SearchIcon
    {...props}
    className={`w-5 h-5 dark:text-white text-black ${props.className}`}
  />
)

export default ViewIcon
