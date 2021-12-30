import { Story, Meta } from '@storybook/react'
import LinhaDaListaDeDados from '.'

export default {
  title: 'LinhaDaListaDeDados',
  component: LinhaDaListaDeDados
} as Meta

export const Default: Story = () => <LinhaDaListaDeDados titulo="" valor="" />
