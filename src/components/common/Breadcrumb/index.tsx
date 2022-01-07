import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react'

import Link from '@/common/Link'

import * as blocks from '@/blocks'
import ChangeTheme from './ChangeTheme'
import { ChevronRightIcon } from '@heroicons/react/outline'
import ReloadPage from '@/common/Breadcrumb/ReloadPage'

type Props = {
  title: string
  reload: { action: () => void; state: boolean }
  currentLocation: { title: string; url: string }[]
  setOpen: Dispatch<SetStateAction<boolean>>
  setShowModal: Dispatch<SetStateAction<boolean>>
  children?: ReactNode
}

const Breadcrumb = ({
  title,
  reload,
  currentLocation,
  setOpen,
  setShowModal,
  children = null
}: Props) => {
  return (
    <div className="flex items-center justify-between flex-1">
      <div>
        <div className="hidden mr-auto -intro-x breadcrumb sm:flex">
          {/* <Link to="/">GoERP</Link> */}
          {currentLocation.map((item, index) => {
            return (
              // <div key={`link-breadcrumb-${index}`}>
              <Fragment key={`link-breadcrumb-${index}`}>
                {index != 0 && <ChevronRightIcon className="w-3 h-3 mx-0.5" />}
                <Link to={item.url} className="breadcrumb--active text-tiny">
                  {item.title}
                </Link>
              </Fragment>
            )
          })}
        </div>
        <div className="text-xl">{title}</div>
      </div>
      <div className="flex items-center justify-center gap-4 divide-x divide-green-500">
        {children}
        <ReloadPage reload={reload} />
        <div className="flex items-center">
          <ChangeTheme />
          <blocks.UserMenu setOpen={setOpen} setShowModal={setShowModal} />
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
