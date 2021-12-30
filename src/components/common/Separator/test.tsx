import { render } from '@testing-library/react'

import Separador from '.'

describe('<Separador />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Separador />)

    expect(container.firstChild)
  })
})
