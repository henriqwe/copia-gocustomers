import { render } from '@testing-library/react'

import DeleteButton from '.'

describe('<DeleteButton />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<DeleteButton />)

    expect(container.firstChild)
  })
})
