import { Story, Meta } from '@storybook/react'
import ListaDeLinhas from '.'

export default {
  title: 'Blocos/Tabela/Linha/ListaDeLinhas',
  component: ListaDeLinhas
} as Meta

export const Default: Story = () => (
  <ListaDeLinhas colunas={[]} linhas={[]} acoes={() => ''} />
)
