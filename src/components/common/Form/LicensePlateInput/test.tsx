import { render } from '@testing-library/react'

import LicensePlateInput from '.'

describe('<LicensePlateInput />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<LicensePlateInput />)

    expect(container.firstChild)
  })
})
