import { render } from '@testing-library/react'

import PrinterIcon from '.'

describe('<PrinterIcon />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<PrinterIcon />)

    expect(container.firstChild)
  })
})
