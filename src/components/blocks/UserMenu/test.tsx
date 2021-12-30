import { render } from '@testing-library/react'

import MenuUsuario from '.'

describe('<MenuUsuario />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <MenuUsuario setTrocarAberto={() => null} setMostrarModal={() => null} />
    )

    expect(container.firstChild)
  })
})
