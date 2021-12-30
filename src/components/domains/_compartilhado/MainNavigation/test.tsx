import { render } from '@testing-library/react'

import MainNavigation from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<MainNavigation />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<MainNavigation />)

    expect(container.firstChild)
  })
})
