import { render } from '@testing-library/react'

import Link from '.'

describe('<Link />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Link to="/" />)

    expect(container.firstChild)
  })
})
