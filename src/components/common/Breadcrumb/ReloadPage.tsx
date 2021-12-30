import { RefreshIcon } from '@heroicons/react/outline'
import AnimateSpin from '../AnimatedSpin'

export default function ReloadPage({
  reload
}: {
  reload: { state: boolean; action: () => void }
}) {
  return reload.state ? (
    <AnimateSpin
      className="w-6 h-6 cursor-pointer text-theme-1 dark:text-theme-2"
      data-testid="spin"
    />
  ) : (
    <RefreshIcon
      className="w-6 h-6 cursor-pointer text-theme-1 dark:text-theme-2"
      onClick={() => reload.action()}
      data-testid="refresh"
    />
  )
}
