import { render } from '@testing-library/react'

import Cartao from '.'

describe('<Cartao />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Cartao>p</Cartao>)

    expect(container.firstChild)
  })
})
