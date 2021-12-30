import { render, screen } from '@testing-library/react'

import Titulo from '.'

describe('<Titulo />', () => {
  it('Deve escoder as ações', () => {
    render(
      <table>
        <thead>
          <Titulo colunas={[]} desativarAcoes />
        </thead>
      </table>
    )

    expect(screen.queryByTestId('semações')).not.toBeInTheDocument()
  })

  it('Deve mostrar as ações', () => {
    render(
      <table>
        <thead>
          <Titulo colunas={[]} desativarAcoes={false} />
        </thead>
      </table>
    )

    expect(screen.getByTestId('semações')).toBeInTheDocument()
  })

  it('Deve mostrar as ações', () => {
    render(
      <table>
        <thead>
          <Titulo
            colunas={[
              { titulo: 'test1', nomeDoCampo: 'test1' },
              { titulo: 'test2', nomeDoCampo: 'test2' }
            ]}
            desativarAcoes={false}
          />
        </thead>
      </table>
    )

    expect(screen.getByText('test1')).toBeInTheDocument()
    expect(screen.getByText('test2')).toBeInTheDocument()
  })
})
