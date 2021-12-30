import { Story, Meta } from '@storybook/react'
import ConfigureMessage from '.'

export default {
  title: 'ConfigureMessage',
  component: ConfigureMessage
} as Meta

export const Default: Story = () => <ConfigureMessage title="" />
