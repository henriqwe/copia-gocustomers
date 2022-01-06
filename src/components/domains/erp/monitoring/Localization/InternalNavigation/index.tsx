import { Actions } from './actions'
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline'
const InternalNavigation = () => {
  const [{ handler }] = Actions()
  return (
    <button onClick={() => handler()} className="btn btn-primary">
      <ChevronDoubleLeftIcon className="w-6 h-6" />
    </button>
  )
}

export default InternalNavigation
