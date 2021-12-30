import { Story, Meta } from '@storybook/react'
import Campo from '.'

export default {
  title: 'Blocos/Tabela/Colunas/Campo',
  component: Campo
} as Meta

export const Default: Story = () => <Campo valor="valor" />
