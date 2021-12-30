import { render } from '@testing-library/react'

import Skeleton from '.'

describe('<Skeleton />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Skeleton />)

    expect(container.firstChild)
  })
})
