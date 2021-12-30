import { ChevronDoubleDownIcon } from '@heroicons/react/outline'

const DownArrowIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <ChevronDoubleDownIcon {...props} className={`${props.className}`} />
)

export default DownArrowIcon
