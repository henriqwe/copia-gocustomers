import { render } from '@testing-library/react'

import Cabecalho from '.'

describe('<Cabecalho />', () => {
  it('Deve renderizar um componente', () => {
    const { container } = render(<Cabecalho />)
    expect(container.firstChild)
  })
})
