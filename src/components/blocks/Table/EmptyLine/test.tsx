import { render } from '@testing-library/react'

import LinhaVazia from '.'

describe('<LinhaVazia />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <table>
        <tbody>
          <LinhaVazia />
        </tbody>
      </table>
    )

    expect(container.firstChild)
  })
})
