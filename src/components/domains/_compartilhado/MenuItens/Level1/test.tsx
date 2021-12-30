import { render } from '@testing-library/react'

import ItemPrincipal from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<ItemPrincipal />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <ItemPrincipal item={{ icone: <p></p>, titulo: '', url: '' }} />
    )

    expect(container.firstChild)
  })
})
