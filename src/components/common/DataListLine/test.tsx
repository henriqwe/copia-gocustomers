import { render } from '@testing-library/react'

import LinhaDaListaDeDados from '.'

describe('<LinhaDaListaDeDados />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<LinhaDaListaDeDados />)

    expect(container.firstChild)
  })
})
