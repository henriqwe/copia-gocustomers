import { render } from '@testing-library/react'

import AddForm from '.'

describe('<AddForm />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(<AddForm />)

    expect(container.firstChild)
  })
})
