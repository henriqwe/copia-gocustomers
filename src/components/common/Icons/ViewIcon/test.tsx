import { render } from '@testing-library/react'

import IconeDeVisualizar from '.'

describe('<IconeDeVisualizar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeVisualizar />)

    expect(container.firstChild)
  })
})
