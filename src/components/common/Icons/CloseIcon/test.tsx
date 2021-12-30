import { render } from '@testing-library/react'

import XIcon from '.'

describe('<XIcon />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<XIcon />)

    expect(container.firstChild)
  })
})
