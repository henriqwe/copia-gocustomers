import { render } from '@testing-library/react'

import InputDeTelefone from '.'
import { useForm } from 'react-hook-form'

describe('<InputDeTelefone />', () => {
  it('Deve renderizar um component', () => {
    const Component = () => {
      const { control } = useForm()
      return <InputDeTelefone control={control} />
    }
    const { container } = render(<Component />)

    expect(container.firstChild)
  })
})
