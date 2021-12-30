import { render } from '@testing-library/react'

import IconeDeAutorizar from '.'

describe('<IconeDeAutorizar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeAutorizar />)

    expect(container.firstChild)
  })
})
