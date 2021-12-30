import { render } from '@testing-library/react'

import IconeDeSetaParaBaixo from '.'

describe('<IconeDeSetaParaBaixo />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<IconeDeSetaParaBaixo />)

    expect(container.firstChild)
  })
})
