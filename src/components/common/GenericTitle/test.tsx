import { render } from '@testing-library/react'

import TituloGenerico from '.'

describe('<TituloGenerico />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<TituloGenerico />)

    expect(container.firstChild)
  })
})
