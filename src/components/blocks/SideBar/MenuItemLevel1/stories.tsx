import { Story, Meta } from '@storybook/react'
import ItemDoMenu from '.'

export default {
  title: 'ItemDoMenu',
  component: ItemDoMenu
} as Meta

export const Default: Story = () => (
  <ItemDoMenu titulo="" url="" icone={<div />} />
)
