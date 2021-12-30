import { render } from '@testing-library/react'

import BotaoExcluirForm from '.'

describe('<BotaoExcluirForm />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<BotaoExcluirForm />)

    expect(container.firstChild)
  })
})
