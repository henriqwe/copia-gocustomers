import { Story, Meta } from '@storybook/react'
import CampoComTituloESubTitulo from '.'

export default {
  title: 'Blocos/Tabela/Colunas/CampoComTituloESubTitulo',
  component: CampoComTituloESubTitulo
} as Meta

export const Default: Story = () => (
  <CampoComTituloESubTitulo titulo="" subTitulo="" />
)
