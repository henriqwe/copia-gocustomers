import { render } from '@testing-library/react'

import IconeDeChecagem from '.'

describe('<IconeDeChecagem />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeChecagem />)

    expect(container.firstChild)
  })
})
