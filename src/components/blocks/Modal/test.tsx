import { render, screen, fireEvent } from '@testing-library/react'

import Modal from '.'

describe('<Modal />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <Modal
        estaAberto={false}
        handler={() => null}
        conteudoDoFormulario={<div />}
        titulo=""
      />
    )

    expect(container.firstChild)
  })

  it('Deve abrir o modal', () => {
    render(
      <Modal
        estaAberto={true}
        handler={() => null}
        conteudoDoFormulario={<div />}
        titulo=""
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('Deve mostrar o titulo test na tela', () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock)
    render(
      <Modal
        estaAberto={true}
        handler={() => null}
        conteudoDoFormulario={<div />}
        titulo="test"
      />
    )

    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('Deve mostrar a div na tela', () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock)
    render(
      <Modal
        estaAberto={true}
        handler={() => null}
        conteudoDoFormulario={
          <div>
            <input type="text" name="test" id="test" placeholder="test" />
          </div>
        }
        titulo=""
      />
    )

    expect(screen.getByPlaceholderText('test')).toBeInTheDocument()
  })

  it('Deve mudar o valor do value com o handler', () => {
    let value
    render(
      <Modal
        estaAberto={true}
        handler={(item: boolean) => (value = item)}
        conteudoDoFormulario={<div />}
        titulo=""
      />
    )
    const button = screen.getByTestId('button')
    fireEvent.click(button)

    expect(value).toBe(false)
  })
})
