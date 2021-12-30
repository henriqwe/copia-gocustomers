import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { Dispatch, SetStateAction } from 'react'

type PaginationProps = {
  collection: any[]
  pagination: {
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
  tableName: string
}
let option = 10
export default function Pagination({
  collection,
  pagination,
  tableName
}: PaginationProps) {
  let currentNumber = 0
  const totalPage = pagination.filters.offset + pagination.filters.limit
  const pages: number[] = collection[
    (tableName + '_aggregate') as unknown as number
  ].nodes
    .map((_: null, index: number) => {
      if (currentNumber !== Math.floor(index / option) + 1) {
        currentNumber = Math.floor(index / option) + 1
        return Math.floor(index / option) + 1
      }
      currentNumber = Math.floor(index / option) + 1
    })
    .filter((item: number) => item !== undefined)

  return (
    <div className="flex flex-wrap items-center justify-between col-span-12 intro-y sm:flex-row sm:flex-nowrap">
      {pages.length > 0 && (
        <>
          <ul className="justify-start pagination">
            {pagination.filters.currentPage !== pages[0] && (
              <>
                <li
                  onClick={() =>
                    pagination.setFilters((old) => {
                      return {
                        limit: old.limit,
                        offset: old.offset - old.limit,
                        currentPage: old.currentPage - 1,
                        where: old.where
                      }
                    })
                  }
                >
                  <p className="pagination__link">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </p>
                </li>
                {pagination.filters.currentPage - 1 !== pages[0] && (
                  <li>
                    <p className="pagination__link">...</p>
                  </li>
                )}
                <li
                  onClick={() =>
                    pagination.setFilters((old) => {
                      return {
                        limit: old.limit,
                        offset: old.offset - old.limit,
                        currentPage: old.currentPage - 1,
                        where: old.where
                      }
                    })
                  }
                >
                  <p className="pagination__link">
                    {pagination.filters.currentPage - 1}
                  </p>
                </li>
              </>
            )}

            <li>
              <p className="pagination__link pagination__link--active">
                {pagination.filters.currentPage}
              </p>
            </li>

            {pagination.filters.currentPage !== pages[pages.length - 1] && (
              <>
                <li
                  onClick={() =>
                    pagination.setFilters((old) => {
                      return {
                        limit: old.limit,
                        offset: old.offset + old.limit,
                        currentPage: old.currentPage + 1,
                        where: old.where
                      }
                    })
                  }
                >
                  <p className="pagination__link">
                    {pagination.filters.currentPage + 1}
                  </p>
                </li>
                {pagination.filters.currentPage + 1 !==
                  pages[pages.length - 1] && (
                  <li>
                    <p className="pagination__link">...</p>
                  </li>
                )}

                <li
                  onClick={() => {
                    pagination.setFilters((old) => {
                      return {
                        limit: old.limit,
                        offset: old.offset + old.limit,
                        currentPage: old.currentPage + 1,
                        where: old.where
                      }
                    })
                  }}
                >
                  <p className="pagination__link">
                    <ChevronRightIcon className="w-4 h-4" />
                  </p>
                </li>
              </>
            )}
          </ul>

          <div className="hidden mx-auto text-gray-600 md:block">
            Exibindo {pagination.filters.offset + 1} de{' '}
            {totalPage >
            collection[(tableName + '_aggregate') as unknown as number].nodes
              .length
              ? collection[(tableName + '_aggregate') as unknown as number]
                  .nodes.length
              : totalPage}{' '}
            do total de{' '}
            {
              collection[(tableName + '_aggregate') as unknown as number]
                .aggregate.count
            }{' '}
            registros
          </div>
          <select
            className="w-20 mt-3 form-select box sm:mt-0"
            onChange={(e) => {
              option = Number(e.target.value)
              pagination.setFilters({
                limit: option,
                offset: 0,
                currentPage: 1,
                where: { deleted_at: { _is_null: true } }
              })
            }}
          >
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </select>
        </>
      )}
    </div>
  )
}
