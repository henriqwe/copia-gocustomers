import { Dispatch, ReactNode, SetStateAction } from 'react'

type AddFormProps = {
  array: number[]
  setArray: Dispatch<SetStateAction<number[]>>
  lastNumber: number
  children: ReactNode

  condition?: any
}

export default function AddForm({
  array,
  setArray,
  children,
  condition = true,
  lastNumber
}: AddFormProps) {
  return (
    <div className="mt-2">
      <span
        className="py-2 pl-6 cursor-pointer"
        onClick={() => {
          if (condition) {
            setArray([...array, lastNumber + 1])
          }
        }}
      >
        {children}
      </span>
    </div>
  )
}
