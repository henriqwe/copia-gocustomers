import { Story, Meta } from '@storybook/react'
import Titulo from '.'

export default {
  title: 'Blocos/Tabela/Colunas/Titulo',
  component: Titulo
} as Meta

export const Default: Story = () => (
  <Titulo colunas={[]} desativarAcoes={false} />
)
