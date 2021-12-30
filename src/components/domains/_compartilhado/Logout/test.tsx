import { render } from '@testing-library/react'

import SairDoSistema from '.'

describe('<SairDoSistema />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <SairDoSistema
        desativado={false}
        mostrarModal={false}
        setDesativado={() => null}
        setMostrarModal={() => null}
      />
    )

    expect(container.firstChild)
  })
})
