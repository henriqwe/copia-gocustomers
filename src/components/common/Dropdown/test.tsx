import { render } from '@testing-library/react'

import Dropdown from '.'

describe('<Dropdown />', () => {
  it('Deve renderizar um componente', () => {
    const { container } = render(<Dropdown />)
    expect(container.firstChild)
  })
})
