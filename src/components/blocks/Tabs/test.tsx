import { render } from '@testing-library/react'

import Guias from '.'

describe('<Guias />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Guias categorias={[]} />)

    expect(container.firstChild)
  })
})
