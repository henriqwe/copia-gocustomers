import React, { ReactChild } from 'react'

import * as common from '@/common'

import Level1 from '@/domains/_compartilhado/MenuItens/Level1'
import Level2 from '@/domains/_compartilhado/MenuItens/Level2'
import Level3 from '@/domains/_compartilhado/MenuItens/Level3'
import rotas from '@/domains/routes'

type SideBarProps = {
  mainMenuItens: [
    {
      title: string
      icon: ReactChild
      url: string
      children?: {
        title: string
        url: string
        icon: ReactChild
        children?: {
          title: string
          url: string
          icon: ReactChild
        }[]
      }[]
    }
  ]
  imageUrl: string
}

export default function SideBar({ mainMenuItens, imageUrl }: SideBarProps) {
  return (
    <nav className="side-nav">
      <common.LogoWithLink url={rotas.erp.home} imageUrl={imageUrl} />
      <common.Divider />
      <ul>
        {mainMenuItens.map((item, index) => {
          return item.children?.length === 0 ? (
            <Level1 item={item} key={`item-menu-${index}`} />
          ) : (
            <Level1 item={item} key={`item-menu-${index}`}>
              {item.children?.map((subitem, contagem) => (
                <Level2 subitem={subitem} key={`subitem-menu-${contagem}`}>
                  {subitem.children?.map((item3, contagem3) => (
                    <Level3 key={`item3-menu-${contagem3}`} item3={item3} />
                  ))}
                </Level2>
              ))}
            </Level1>
          )
        })}
      </ul>
    </nav>
  )
}
