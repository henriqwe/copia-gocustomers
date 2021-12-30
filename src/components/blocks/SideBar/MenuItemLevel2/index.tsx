import * as common from '@/common'
import * as icons from '@/common/Icons'
import { Dispatch, ReactChild, ReactNode, SetStateAction } from 'react'

type SubMenuItemType = {
  title: string
  url: string
  icon: ReactChild
  children: ReactNode
  active?: boolean
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function SubItemDoMenu({
  title,
  url,
  icon,
  children,
  active,
  open,
  setOpen
}: SubMenuItemType) {
  return (
    <>
      {children ? (
        <li>
          <a
            className={`side-menu cursor-pointer ${
              active && 'side-menu--active'
            }`}
            onClick={() => {
              setOpen(!open)
            }}
          >
            <div className="side-menu__icon">{icon}</div>
            <div className="side-menu__title">
              {title}
              {children && (
                <div className="transform side-menu__sub-icon">
                  <icons.DownArrowIcon
                    className={`w-4 h-4 mx-4 transition ${
                      open && 'rotate-180'
                    }`}
                  />
                </div>
              )}
            </div>
          </a>
          {children && open && (
            <ul className="side-menu__sub-open">{children}</ul>
          )}
        </li>
      ) : (
        <li>
          <common.Link
            to={url}
            className={`side-menu ${active && 'side-menu--active'}`}
          >
            <div className="side-menu__icon">{icon}</div>
            <div className="side-menu__title"> {title} </div>
          </common.Link>
        </li>
      )}
    </>
  )
}
