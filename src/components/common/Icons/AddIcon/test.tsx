import { render } from '@testing-library/react'

import IconeDeAdicionar from '.'

describe('<IconeDeAdicionar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeAdicionar />)

    expect(container.firstChild)
  })
})
