import { render } from '@testing-library/react'

import TituloComSubtituloNoTopo from '.'

describe('<TituloComSubtituloNoTopo />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<TituloComSubtituloNoTopo />)

    expect(container.firstChild)
  })
})
