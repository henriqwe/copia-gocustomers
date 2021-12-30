import { BanIcon } from '@heroicons/react/outline'

const BlockIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <BanIcon {...props} className={`w-5 h-5 text-white ${props.className}`} />
)

export default BlockIcon
