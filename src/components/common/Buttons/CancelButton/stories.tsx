import { Story, Meta } from '@storybook/react'
import BotaoCancelar from '.'

export default {
  title: 'BotaoCancelar',
  component: BotaoCancelar
} as Meta

export const Default: Story = () => <BotaoCancelar onClick={() => null} />
