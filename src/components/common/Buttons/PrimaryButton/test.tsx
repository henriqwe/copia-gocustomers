import { render } from '@testing-library/react'

import BotaoAcaoPrincipal from '.'

describe('<BotaoAcaoPrincipal />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <BotaoAcaoPrincipal desativado={false} titulo="" />
    )

    expect(container.firstChild)
  })
})
