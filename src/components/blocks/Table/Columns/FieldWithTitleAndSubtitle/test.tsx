import { render, screen } from '@testing-library/react'

import CampoComTituloESubTitulo from '.'

describe('<CampoComTituloESubTitulo />', () => {
  it('Deve renderizar titulo e subtitulo', () => {
    render(
      <table>
        <tbody>
          <tr>
            <CampoComTituloESubTitulo subTitulo="subtitulo" titulo="titulo" />
          </tr>
        </tbody>
      </table>
    )

    expect(screen.getByText('subtitulo')).toBeInTheDocument()
    expect(screen.getByText('titulo')).toBeInTheDocument()
  })
})
