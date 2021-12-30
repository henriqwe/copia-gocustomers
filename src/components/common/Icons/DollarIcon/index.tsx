import { CurrencyDollarIcon } from '@heroicons/react/outline'

const DollarIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <CurrencyDollarIcon
    {...props}
    className={`w-5 h-5 text-theme-9 ${props.className}`}
  />
)

export default DollarIcon
