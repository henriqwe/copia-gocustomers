import { render } from '@testing-library/react'

import IconeDeRecarregar from '.'

describe('<IconeDeRecarregar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeRecarregar />)

    expect(container.firstChild)
  })
})
