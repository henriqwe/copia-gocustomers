import { render } from '@testing-library/react'

import ListaDeLinhas from '.'

describe('<ListaDeLinhas />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <ListaDeLinhas
        desativarAcoes
        acoes={() => null}
        colunas={[]}
        linhas={[]}
      />
    )

    expect(container.firstChild)
  })
})
