import { RefreshIcon as HeroIconRefresh } from '@heroicons/react/outline'

const ReloadIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <HeroIconRefresh {...props} className={`${props.className}`} />
)

export default ReloadIcon
