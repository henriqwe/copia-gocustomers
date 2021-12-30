import { render } from '@testing-library/react'

import BotaoCancelar from '.'

describe('<BotaoCancelar />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<BotaoCancelar />)

    expect(container.firstChild)
  })
})
