import { render } from '@testing-library/react'

import ItemDoMenu from '.'

describe('<ItemDoMenu />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <ItemDoMenu titulo="" url="" icone={<div />} />
    )

    expect(container.firstChild)
  })
})
