import { Story, Meta } from '@storybook/react'
import Modal from '.'

export default {
  title: 'Modal',
  component: Modal
} as Meta

export const Default: Story = () => (
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
