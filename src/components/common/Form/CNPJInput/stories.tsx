import { Story, Meta } from '@storybook/react'
import * as common from '@/common'

export default {
  title: 'InputDeCnpj',
  component: common.InputDeCNPJ
} as Meta

export const Default: Story = () => <common.InputDeCNPJ register={() => null} />
