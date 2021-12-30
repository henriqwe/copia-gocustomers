import { render } from '@testing-library/react'

import BotaoVoltar from '.'

describe('<BotaoVoltar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<BotaoVoltar />)

    expect(container.firstChild)
  })
})
