import { render } from '@testing-library/react'

import LinkCadastro from '.'

describe('<LinkCadastro />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <LinkCadastro onClick={() => null}>a</LinkCadastro>
    )

    expect(container.firstChild)
  })
})
