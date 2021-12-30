import { useTheme } from 'contexts/ThemeContext'
import { useRouter } from 'next/router'

import * as blocks from '@/blocks'

import mainMenuItens from '@/domains/MainMenuItens'

export default function MainNavigation() {
  const router = useRouter()
  const { theme } = useTheme()
  const company = router.asPath.split('/')[1]
  let imageUrl = '/imagens/logo'

  if ('undefined' != typeof screen) {
    switch (company) {
      case 'assistencia':
        imageUrl = imageUrl + 'Assistencia'
        if (screen.width < 768) {
          imageUrl = imageUrl + 'Curta'
        }
        if (theme === 'dark') {
          imageUrl = imageUrl + 'Dark'
        }
        break
      case 'maxline':
        imageUrl = imageUrl + 'Maxline'
        if (screen.width < 768) {
          imageUrl = imageUrl + 'Curta'
        }
        if (theme === 'dark') {
          imageUrl = imageUrl + 'Dark'
        }
        break
      default:
        imageUrl = imageUrl + 'Rastreamento'
        if (screen.width < 768) {
          imageUrl = imageUrl + 'Curta'
        }
        if (theme === 'dark') {
          imageUrl = imageUrl + 'Dark'
        }
    }
    imageUrl = imageUrl + '.png'
    // FIXME resolver tipagem do objeto do company
    return (
      <blocks.SideBar
        mainMenuItens={mainMenuItens[company]}
        imageUrl={imageUrl}
      />
    )
  }
  return <></>
}
