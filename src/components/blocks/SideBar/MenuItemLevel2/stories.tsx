import { Story, Meta } from '@storybook/react'
import SubItemDoMenu from '.'

export default {
  title: 'SubItemDoMenu',
  component: SubItemDoMenu
} as Meta

export const Default: Story = () => (
  <SubItemDoMenu url="" titulo="" icone={<div />} />
)
