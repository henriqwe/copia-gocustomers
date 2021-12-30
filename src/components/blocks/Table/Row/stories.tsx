import { Story, Meta } from '@storybook/react'
import Linha from '.'

export default {
  title: 'Blocos/Tabela/Linha/Linha',
  component: Linha
} as Meta

export const Default: Story = () => (
  <Linha item="" colunas={[]} acoes={() => null} />
)
