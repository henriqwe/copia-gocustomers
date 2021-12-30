import { render } from '@testing-library/react'

import UploadFile from '.'

describe('<UploadFile />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<UploadFile />)

    expect(container.firstChild)
  })
})
