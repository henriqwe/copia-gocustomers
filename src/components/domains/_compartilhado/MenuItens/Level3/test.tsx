import { render } from '@testing-library/react'

import Item3 from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<Item3 />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <Item3 item3={{ icone: <p></p>, titulo: '', url: '' }} />
    )

    expect(container.firstChild)
  })
})
