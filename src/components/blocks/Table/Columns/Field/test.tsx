import { render, screen } from '@testing-library/react'

import Campo from '.'

describe('<Campo />', () => {
  it('Deve renderizar um component', () => {
    render(
      <table>
        <tbody>
          <tr>
            <Campo valor="test" />
          </tr>
        </tbody>
      </table>
    )

    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
