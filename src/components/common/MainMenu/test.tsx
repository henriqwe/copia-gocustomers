import { render, screen } from '@testing-library/react'

import MenuPrincipal from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<MenuPrincipal />', () => {
  it('Deve renderizar os 2 links', () => {
    render(
      <MenuPrincipal
        grupoDeLinks={[
          { titulo: 'test1', url: '/' },
          { titulo: 'test2', url: '/' }
        ]}
      />
    )

    expect(screen.getByTestId('links').children.length).toBe(2)
  })

  it('Deve renderizar os 2 filtros', () => {
    render(
      <MenuPrincipal
        grupoDeLinks={[]}
        grupoDeFiltros={[
          { titulo: 'test1', url: '/' },
          { titulo: 'test2', url: '/' }
        ]}
      />
    )

    expect(screen.getByTestId('filtros').children.length).toBe(2)
  })

  it('Deve renderizar os 2 filtros', () => {
    render(
      <MenuPrincipal
        grupoDeLinks={[]}
        gruposDeAcoes={[
          { titulo: 'test1', url: '/' },
          { titulo: 'test2', url: '/' }
        ]}
      />
    )

    expect(screen.getByTestId('ações').children.length).toBe(2)
  })
})
