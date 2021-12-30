import { render } from '@testing-library/react'

import ConteudoVazio from '.'

describe('<ConteudoVazio />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<ConteudoVazio />)

    expect(container.firstChild)
  })
})
