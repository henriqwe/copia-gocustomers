import { XIcon } from '@heroicons/react/outline'

function CloseIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <XIcon className={`w-5 h-5 text-white ${props.className}`} {...props} />
  )
}
export default CloseIcon
