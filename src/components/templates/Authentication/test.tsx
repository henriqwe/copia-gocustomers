import { render } from '@testing-library/react'

import Autenticacao from '.'

describe('<Autenticacao />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Autenticacao />)

    expect(container.firstChild)
  })
})
