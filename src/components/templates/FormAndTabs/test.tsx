import { render, screen } from '@testing-library/react'

import TemplateDeDuasColunas from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<Base />', () => {
  it('Deve renderizar o component', () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock)
    render(
      <TemplateDeDuasColunas
        Formulario={<p>SubMenu</p>}
        recarregar={{ acao: () => null, estado: false }}
        titulo=""
        localizacaoAtual={[]}
      >
        <p>Test</p>
      </TemplateDeDuasColunas>
    )

    expect(screen.getByText('SubMenu')).toBeInTheDocument()
  })

  it('Deve renderizar o component', () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock)
    render(
      <TemplateDeDuasColunas
        Formulario={<p>SubMenu</p>}
        recarregar={{ acao: () => null, estado: false }}
        titulo="titulo"
        localizacaoAtual={[]}
      >
        <p>Test</p>
      </TemplateDeDuasColunas>
    )

    expect(screen.getByText('titulo')).toBeInTheDocument()
  })
})
