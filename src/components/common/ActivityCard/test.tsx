import { render } from '@testing-library/react'

import ActivityCard from '.'

describe('<ActivityCard />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<ActivityCard />)

    expect(container.firstChild)
  })
})
