import { render } from '@testing-library/react'

import ListaDetalhes from '.'

describe('<ListaDetalhes />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<ListaDetalhes />)

    expect(container.firstChild)
  })
})
