import { render } from '@testing-library/react'

import AlternarEmpresa from '.'

describe('<AlternarEmpresa />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <AlternarEmpresa
        empresa=""
        setEmpresa={() => null}
        trocarAberto={false}
        setTrocarAberto={() => null}
      />
    )

    expect(container.firstChild)
  })
})
