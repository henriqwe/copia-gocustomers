import { render } from '@testing-library/react'

import Modal from '.'

describe('<Modal />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      <Modal
        onClose={() => null}
        aberto={true}
        tituloDoBotao=""
        tituloDoModal="Quer realmente deletar?"
        descricao="Essa ação não podera ser desfeita!"
        FuncaoPrincipal={() => null}
        desativado={true}
      />
    )

    expect(container.firstChild)
  })
})
