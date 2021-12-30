import * as icons from '@/common/Icons'
import Router from 'next/router'
import { Dispatch, SetStateAction } from 'react'

export type MenuItemType = {
  children?: React.ReactChild[]
  title: string
  url: string
  icon: React.ReactChild
  active?: boolean
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export default function ItemDoMenu({
  children,
  title,
  icon,
  url,
  open = false,
  active = false,
  setOpen = () => null
}: MenuItemType) {
  return (
    <li>
      <div
        className={`side-menu cursor-pointer ${active && 'side-menu--active'}`}
        onClick={() => {
          if (url && !children) {
            Router.push(url)
            return
          }
          setOpen(!open)
        }}
      >
        <div className="side-menu__icon">{icon}</div>
        <div className="side-menu__title">
          {title}
          {children && (
            <div className="transform side-menu__sub-icon">
              <icons.DownArrowIcon
                className={`w-4 h-4 mx-4 transition ${open && 'rotate-180'}`}
              />
            </div>
          )}
        </div>
      </div>
      {children && open && <ul className="side-menu__sub-open">{children}</ul>}
    </li>
  )
}
