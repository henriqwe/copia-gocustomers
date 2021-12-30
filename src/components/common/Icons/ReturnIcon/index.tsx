import { SwitchVerticalIcon } from '@heroicons/react/outline'

const ReturnIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <SwitchVerticalIcon
    {...props}
    className={` w-5 h-5 text-white ${props.className}`}
  />
)

export default ReturnIcon
