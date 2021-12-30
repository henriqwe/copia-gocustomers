import { render } from '@testing-library/react'

import Logo from '.'

describe('<Logo />', () => {
  it('Deve renderizar um componente', () => {
    const { container } = render(<Logo urlDaImagem="" />)
    expect(container.firstChild)
  })
})
