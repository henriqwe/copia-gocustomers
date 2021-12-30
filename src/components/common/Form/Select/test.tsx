import { render } from '@testing-library/react'

import Select from '.'

describe('<Select />', () => {
  it('should render the heading', () => {
    const { container } = render(
      <Select
        items={[{ key: '', titulo: '' }]}
        onChange={() => null}
        value={{ key: '', titulo: '' }}
      />
    )

    expect(container.firstChild)
  })
})
