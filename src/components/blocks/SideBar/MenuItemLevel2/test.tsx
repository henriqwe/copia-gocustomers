import { render } from '@testing-library/react'

import SubItemDoMenu from '.'

describe('<SubItemDoMenu />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <SubItemDoMenu url="" titulo="" icone={<div />} />
    )

    expect(container.firstChild)
  })
})
