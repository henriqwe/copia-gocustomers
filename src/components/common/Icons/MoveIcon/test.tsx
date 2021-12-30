import { render } from '@testing-library/react'

import IconeDeBaixa from '.'

describe('<IconeDeBaixa />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeBaixa />)

    expect(container.firstChild)
  })
})
