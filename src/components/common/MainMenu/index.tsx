import React, { Dispatch, SetStateAction, useState } from 'react'
import Actions from '@/common/MainMenu/Actions'
import Filters from '@/common/MainMenu/Filters'
import Links from '@/common/MainMenu/Links'
import { useRouter } from 'next/router'
import * as buttons from '@/common/Buttons'
import * as icons from '@/common/Icons'
import * as common from '@/common'
import Search from '@/blocks/Table/Search'

type MainMenuProps = {
  LinkGroup?: {
    title: string
    url: string
  }[]
  FiltersGroup?: {
    title: string
    url?: string
    handler?: () => any
  }[]
  ActionsGroup?: {
    title: string
    url?: string
    handler?: () => void
  }[]
  search?: { field: string[]; where: any }
  filters?: {
    where: any
  }
  setFilters?: Dispatch<SetStateAction<any>>
}

export default function MainMenu({
  LinkGroup = [],
  FiltersGroup = [],
  ActionsGroup = [],
  filters,
  setFilters = () => null,
  search
}: MainMenuProps) {
  const [disabledAll, setDisabledAll] = useState(false)
  const router = useRouter()
  return (
    <div className="p-5 intro-y box">
      <div
        className="pb-4 mb-3 border-b border-gray-300 dark:border-dark-5"
        data-testid="ações"
      >
        {ActionsGroup.length
          ? ActionsGroup.map((item, index) => (
              <Actions
                active={item.url === router.asPath}
                item={item}
                key={`left-side-nav-filter-${index}`}
              />
            ))
          : null}
      </div>

      {LinkGroup.length ? (
        <div data-testid="links">
          {LinkGroup.map((item, index) => (
            <Links
              active={item.url === router.asPath}
              item={item}
              key={`left-side-nav-item-${index}`}
            />
          ))}
        </div>
      ) : null}

      {search && (
        <>
          <Search
            search={search}
            pagination={{
              filters: filters as {
                limit: number
                offset: number
                currentPage: number
                where: any
              },
              setFilters
            }}
            sideBar
          />
          <common.Separator />
        </>
      )}

      <div
        className={`mt-3 ${
          LinkGroup.length ? 'pt-4 border-t border-gray-300' : ''
        } dark:border-dark-5`}
        data-testid="filtros"
      >
        {filters ? (
          filters.where ? (
            Object.keys(filters.where).length > 1 ? (
              <buttons.CancelButton
                title="Remover filtros"
                icon={<icons.DeleteIcon className="w-5 h-5 mr-2 text-white" />}
                onClick={() => {
                  setFilters((old: { limit: number }) => {
                    return {
                      currentPage: 1,
                      limit: old.limit,
                      offset: 0,
                      where: {
                        deleted_at: { _is_null: true }
                      }
                    }
                  })
                  setDisabledAll(true)
                }}
                iconPosition="left"
                className="w-full"
              />
            ) : null
          ) : null
        ) : null}

        {FiltersGroup.length
          ? FiltersGroup.map((item, index) => (
              <Filters
                item={item}
                key={`left-side-nav-filter-${index}`}
                disabledAll={disabledAll}
              />
            ))
          : ''}
      </div>
    </div>
  )
}
