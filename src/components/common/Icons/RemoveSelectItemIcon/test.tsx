import { render } from '@testing-library/react'

import RemoveSelectItemIcon from '.'

describe('<RemoveSelectItemIcon />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<RemoveSelectItemIcon />)

    expect(container.firstChild)
  })
})
