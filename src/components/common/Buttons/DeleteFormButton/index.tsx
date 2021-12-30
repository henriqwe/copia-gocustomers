import { Dispatch, SetStateAction } from 'react'
import * as icons from '@/common/Icons'

type DeleteFormButtonProps = {
  array: number[]
  setArray: Dispatch<SetStateAction<number[]>>
  loading: boolean
  number: number
}

function DeleteFormButton({
  array,
  setArray,
  loading,
  number
}: DeleteFormButtonProps) {
  return (
    <div>
      <button
        onClick={() => {
          setArray(array.filter((position) => position !== number))
        }}
        className={`mb-1 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : ''
        } py-2 px-4 rounded-md bg-primary-3 transition text-white flex items-center`}
        type="button"
      >
        <icons.DeleteIcon width={28} height={28} className={'text-theme-2'} />
      </button>
    </div>
  )
}
export default DeleteFormButton
