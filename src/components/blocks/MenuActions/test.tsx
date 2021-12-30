import { render } from '@testing-library/react'

import AcoesDoMenu from '.'

describe('<AcoesDoMenu />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<AcoesDoMenu />)

    expect(container.firstChild)
  })
})
