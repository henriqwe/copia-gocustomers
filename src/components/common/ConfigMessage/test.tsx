import { render } from '@testing-library/react'

import ConfigureMessage from '.'

describe('<ConfigureMessage />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<ConfigureMessage title="" />)

    expect(container.firstChild)
  })
})
