import { render } from '@testing-library/react'

import GrupoOpcoes from '.'

describe('<GrupoOpcoes />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <GrupoOpcoes empresas={[]} setEmpresa={() => null} />
    )

    expect(container.firstChild)
  })
})
