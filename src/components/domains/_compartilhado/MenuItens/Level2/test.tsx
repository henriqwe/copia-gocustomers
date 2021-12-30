import { render } from '@testing-library/react'

import SubItem from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<SubItem />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <SubItem subitem={{ icone: <p></p>, titulo: '', url: '' }}>
        <p>a</p>
      </SubItem>
    )

    expect(container.firstChild)
  })
})
