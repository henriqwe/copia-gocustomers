import { Actions } from './actions'
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline'
const InternalNavigation = () => {
  const [{ handler }] = Actions()
  return (
    <button
      onClick={() => handler()}
      className="rounded-l-md px-1 py-2 bg-theme-9  text-dark-7 h-full w-full"
    >
      <ChevronDoubleLeftIcon className="w-6 h-6" />
    </button>
  )
}

export default InternalNavigation
