import { render, screen } from '@testing-library/react'

import CampoParaOStatus from '.'

describe('<CampoParaOStatus />', () => {
  it('Deve renderizar um component', () => {
    render(
      <table>
        <tbody>
          <tr>
            <CampoParaOStatus valor="test" />
          </tr>
        </tbody>
      </table>
    )

    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
