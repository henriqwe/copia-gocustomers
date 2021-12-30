import { render } from '@testing-library/react'

import Switch from '.'

describe('<Switch />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Switch />)

    expect(container.firstChild)
  })
})
