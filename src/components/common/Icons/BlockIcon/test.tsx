import { render } from '@testing-library/react'

import BlockIcon from '.'

describe('<BlockIcon />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<BlockIcon />)

    expect(container.firstChild)
  })
})
