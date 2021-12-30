import { Dispatch, SetStateAction, useState } from 'react'
import * as form from '@/common/Form'
import * as buttons from '@/common/Buttons'
import * as icons from '@/common/Icons'
import { useForm } from 'react-hook-form'

type SearchProps = {
  search?: { field: string[]; where: any }
  pagination?: {
    filters: { limit: number; offset: number; currentPage: number; where: any }
    setFilters: Dispatch<
      SetStateAction<{
        limit: number
        offset: number
        currentPage: number
        where: any
      }>
    >
  }
  sideBar?: boolean
}

export default function Search({ search, pagination, sideBar }: SearchProps) {
  const { register, watch, setValue } = useForm()
  const [showRemoveButton, setShowRemoveButton] = useState(false)

  return (
    <div className={'flex items-start justify-end gap-4 pt-4'}>
      <div className={`flex-1 mb-2 ${sideBar ? '' : 'max-w-1/2'}`}>
        <form.Input
          fieldName="searchValue"
          title={`Digite o ${search?.field.map((item) => ' ' + item)} desejado`}
          register={register}
        />
      </div>
      <div className="flex justify-between gap-4">
        {showRemoveButton && (
          <buttons.CancelButton
            icon={<icons.CloseIcon />}
            title=""
            onClick={() => {
              setValue('searchValue', undefined)
              pagination?.setFilters((old) => {
                return {
                  currentPage: 1,
                  limit: old.limit,
                  offset: 0,
                  where: { deleted_at: { _is_null: true } }
                }
              })
              setShowRemoveButton(false)
            }}
            className={`h-10 my-0`}
          />
        )}
        <buttons.SecondaryButton
          handler={() => {
            pagination?.setFilters((old) => {
              return {
                currentPage: 1,
                limit: old.limit,
                offset: 0,
                where: search?.where(watch('searchValue'))
              }
            })
            setShowRemoveButton(true)
          }}
          disabled={
            watch('searchValue') === undefined || watch('searchValue') === ''
          }
          title={<icons.ViewIcon />}
          buttonClassName="h-10"
        />
      </div>
    </div>
  )
}
