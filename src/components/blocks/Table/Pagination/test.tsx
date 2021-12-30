import { render } from '@testing-library/react'

import Paginacao from '.'

describe('<Paginacao />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<Paginacao />)

    expect(container.firstChild)
  })
})
