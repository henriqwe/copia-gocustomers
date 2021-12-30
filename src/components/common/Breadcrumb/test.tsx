import { render, screen, fireEvent } from '@testing-library/react'

import Breadcrumb from '.'

describe('<NavegacaoDeMigalhaDePao />', () => {
  it('Deve renderizar um título', () => {
    render(
      <Breadcrumb
        titulo="Título da página"
        recarregar={{ acao: () => null, estado: false }}
        localizacaoAtual={[
          { titulo: 'Rastreamento', url: '/rastreamento' },
          { titulo: 'Estoque', url: '/rastreamento/estoque' },
          { titulo: 'Cadastros', url: '/rastreamento/estoque/cadastros' },
          {
            titulo: 'Grupos de estoque',
            url: '/rastreamento/estoque/cadastros/grupos'
          }
        ]}
        setTrocarAberto={() => null}
        setMostrarModal={() => null}
      />
    )
    expect(screen.getByText('Título da página')).toBeInTheDocument()
  })

  it('Deve acionar a ação', () => {
    let value
    render(
      <Breadcrumb
        titulo="Título da página"
        recarregar={{
          acao: () => {
            value = 1
          },
          estado: false
        }}
        localizacaoAtual={[]}
        setTrocarAberto={() => null}
        setMostrarModal={() => null}
      />
    )
    const button = screen.getByTestId('refresh')
    fireEvent.click(button)

    expect(value).toBe(1)
  })

  it('Deve acionar a ação', () => {
    render(
      <Breadcrumb
        titulo="Título da página"
        recarregar={{
          acao: () => null,
          estado: true
        }}
        localizacaoAtual={[]}
        setTrocarAberto={() => null}
        setMostrarModal={() => null}
      />
    )

    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })
})
