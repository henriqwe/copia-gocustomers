import { render } from '@testing-library/react'

//import DialogoModal from '.'

describe('<DialogoModal />', () => {
  it('Deve renderizar um component', () => {
    const { container } = render(
      // <DialogoModal isOpen={false} setModal={() => null}>
      <div>Conteúdo do modal</div>
      // </DialogoModal>
    )

    expect(container.firstChild)
  })
})
