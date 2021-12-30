import { render } from '@testing-library/react'

import BotaoSecundario from '.'

describe('<BotaoSecundario />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<BotaoSecundario handler={() => null} />)

    expect(container.firstChild)
  })
})
