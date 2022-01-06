import { Actions } from './actions'
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline'
const InternalNavigation = () => {
  const [{ handler }] = Actions()
  return (
    <button
      onClick={() => handler()}
      className="rounded-l-md px-2 py-2 dark:bg-dark-3"
    >
      <ChevronDoubleLeftIcon className="w-6 h-6" />
    </button>
  )
}

export default InternalNavigation
