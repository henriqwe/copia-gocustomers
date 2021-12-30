import { render } from '@testing-library/react'

import IconeDeExcluir from '.'

describe('<IconeDeExcluir />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeExcluir />)

    expect(container.firstChild)
  })
})
