import { Story, Meta } from '@storybook/react'
import Skeleton from '.'

export default {
  title: 'Skeleton',
  component: Skeleton
} as Meta

export const Default: Story = () => <Skeleton />
