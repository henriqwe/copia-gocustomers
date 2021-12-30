import { Story, Meta } from '@storybook/react'
import BotaoAcaoPrincipal from '.'

export default {
  title: 'BotaoAcaoPrincipal',
  component: BotaoAcaoPrincipal
} as Meta

export const Default: Story = () => (
  <BotaoAcaoPrincipal desativado={false} titulo="" />
)
