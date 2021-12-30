import { render } from '@testing-library/react'

import BurguerIcon from '.'

describe('<BurguerIcon />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<BurguerIcon />)

    expect(container.firstChild)
  })
})
