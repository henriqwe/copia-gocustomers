import { render, screen } from '@testing-library/react'

import Tabela from '.'

describe('<Modal />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <Tabela
        acoes={() => null}
        colecao={[]}
        titulosDasColunas={[]}
        desativarAcoes
        paginacao
      />
    )

    expect(container.firstChild)
  })

  it('Deve renderizar um coleção', () => {
    render(
      <Tabela
        acoes={() => null}
        colecao={[
          { titulo: 'Nome', nomeDoCampo: 'Nome' },
          { titulo: 'Nome', nomeDoCampo: 'Nome' }
        ]}
        titulosDasColunas={[]}
        desativarAcoes
        paginacao
      />
    )
    expect(screen.getByTestId('tbody').children.length).toBe(2)
  })

  it('Deve retirar a paginação', () => {
    render(
      <Tabela
        acoes={() => null}
        colecao={[]}
        titulosDasColunas={[]}
        desativarAcoes
        paginacao={false}
      />
    )
    expect(screen.getByTestId('sempagina')).toBeInTheDocument()
  })
})
