import { render } from '@testing-library/react'
import * as common from '@/common'
import { useForm } from 'react-hook-form'

describe('<InputDeCnpj />', () => {
  it('Deve renderizar um component', () => {
    const Component = () => {
      const { control, register } = useForm()
      return <common.InputDeCNPJ register={register} control={control} />
    }
    const { container } = render(<Component />)

    expect(container.firstChild)
  })
})
