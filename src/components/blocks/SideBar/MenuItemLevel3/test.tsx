import { render } from '@testing-library/react'

import ItemNivel3 from '.'

describe('<ItemNivel3 />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <ItemNivel3 icone={<p></p>} titulo="" url="" />
    )

    expect(container.firstChild)
  })
})
