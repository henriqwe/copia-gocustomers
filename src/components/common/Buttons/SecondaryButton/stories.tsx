import { Story, Meta } from '@storybook/react'
import BotaoSecundario from '.'

export default {
  title: 'BotaoAcaoSecundaria',
  component: BotaoSecundario
} as Meta

export const Default: Story = () => <BotaoSecundario handler={() => null} />
