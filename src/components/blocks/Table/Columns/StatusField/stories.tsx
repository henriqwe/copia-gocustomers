import { Story, Meta } from '@storybook/react'
import CampoParaOStatus from '.'

export default {
  title: 'Blocos/Tabela/Colunas/CampoParaOStatus',
  component: CampoParaOStatus
} as Meta

export const Default: Story = () => <CampoParaOStatus valor="" />
