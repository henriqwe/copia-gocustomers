import { render, screen } from '@testing-library/react'
import Input from '.'

describe('<Input />', () => {
  it('Deve mostrar o titulo Nome', () => {
    render(<Input nomeDoCampo="Nome" titulo="Nome" register={() => null} />)

    expect(screen.getByText('Nome')).toBeInTheDocument()
  })
})
