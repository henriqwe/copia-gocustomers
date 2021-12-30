import { PlusIcon } from '@heroicons/react/outline'

const AddIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <PlusIcon {...props} className={`${props.className}`} />
)

export default AddIcon
