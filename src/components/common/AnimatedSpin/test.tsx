import { render } from '@testing-library/react'

import SpinAnimado from '.'

describe('<SpinAnimado />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<SpinAnimado />)

    expect(container.firstChild)
  })
})
