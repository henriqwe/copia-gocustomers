import { render } from '@testing-library/react'

import LogoComLink from '.'

describe('<LogoComLink />', () => {
  it('Deve renderizar um componente', () => {
    const { container } = render(<LogoComLink url="" urlDaImagem="" />)
    expect(container.firstChild)
  })
})
