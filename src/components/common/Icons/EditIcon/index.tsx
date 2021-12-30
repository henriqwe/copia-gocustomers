import { PencilIcon } from '@heroicons/react/outline'

function EditIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <PencilIcon
      className={`w-5 h-5 text-theme-7 ${props.className}`}
      {...props}
    />
  )
}
export default EditIcon
