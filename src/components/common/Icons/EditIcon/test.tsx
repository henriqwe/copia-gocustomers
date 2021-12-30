import { render } from '@testing-library/react'

import IconeDeEditar from '.'

describe('<IconeDeEditar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeEditar />)

    expect(container.firstChild)
  })
})
