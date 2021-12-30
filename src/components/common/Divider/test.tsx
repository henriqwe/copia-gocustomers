import { render } from '@testing-library/react'

import Divididor from '.'

describe('<Divididor />', () => {
  it('Deve renderizar um componente', () => {
    const { container } = render(<Divididor />)
    expect(container.firstChild)
  })
})
