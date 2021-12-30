import { render } from '@testing-library/react'

import ListaDeDados from '.'

describe('<ListaDeDados />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<ListaDeDados dados={[]} />)

    expect(container.firstChild)
  })
})
