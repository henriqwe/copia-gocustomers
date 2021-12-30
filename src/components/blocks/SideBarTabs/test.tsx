import { render } from '@testing-library/react'

import SideBarTabs from '.'

describe('<SideBarTabs />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<SideBarTabs />)

    expect(container.firstChild)
  })
})
