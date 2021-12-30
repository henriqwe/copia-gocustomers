import { render, screen } from '@testing-library/react'

import Linha from '.'

describe('<Linha />', () => {
  it('Deve renderizar as colunas', () => {
    render(
      <table>
        <tbody>
          <Linha
            item=""
            desativarAcoes
            colunas={[
              { titulo: 'test1', nomeDoCampo: 'test1' },
              { titulo: 'test2', nomeDoCampo: 'test2' }
            ]}
            acoes={() => null}
          />
        </tbody>
      </table>
    )
    const lista = screen.getByTestId('linha')

    expect(lista.children.length).toBe(2)
  })

  it('Deve deixar as ações visiveis', () => {
    let value
    render(
      <table>
        <tbody>
          <Linha
            item="test"
            desativarAcoes={false}
            colunas={[]}
            acoes={(item) => {
              value = item.item
              return <th>a</th>
            }}
          />
        </tbody>
      </table>
    )

    expect(value).not.toBeUndefined()
  })
})
