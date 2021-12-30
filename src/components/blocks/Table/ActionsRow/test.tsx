import { render, screen, fireEvent } from '@testing-library/react'
import { ReactNode } from 'react'

import CampoComAcao from '.'

jest.mock(
  'next/link',
  () =>
    ({ children }: { children: ReactNode }) =>
      children
)

jest.mock('next/router', () => {
  const router = {
    push: (item: string) => item
  }
  return router
})

describe('<CampoComAcao />', () => {
  it('Deve renderizar um component', () => {
    render(
      <table>
        <tbody>
          <tr>
            <CampoComAcao
              acoes={[
                {
                  titulo: '',
                  url: '/',
                  icone: <span />,
                  handler: async () => undefined
                },
                {
                  titulo: '',
                  url: '/',
                  icone: <span />,
                  handler: async () => undefined
                }
              ]}
            />
          </tr>
        </tbody>
      </table>
    )

    expect(screen.getByTestId('ações').children.length).toBe(2)
  })

  it('Deve ativar o lidar com ações', () => {
    let value
    render(
      <table>
        <tbody>
          <tr>
            <CampoComAcao
              acoes={[
                {
                  titulo: '',
                  icone: <span />,
                  handler: async () => {
                    value = true
                  }
                }
              ]}
            />
          </tr>
        </tbody>
      </table>
    )
    const button = screen.getByTestId('button')
    fireEvent.click(button)

    expect(value).toBe(true)
  })
})
