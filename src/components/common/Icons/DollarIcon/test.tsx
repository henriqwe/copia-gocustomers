import { render } from '@testing-library/react'

import DollarIcon from '.'

describe('<DollarIcon />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<DollarIcon />)

    expect(container.firstChild)
  })
})
