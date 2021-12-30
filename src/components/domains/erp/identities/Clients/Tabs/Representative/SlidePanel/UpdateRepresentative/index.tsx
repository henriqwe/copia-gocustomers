import { Documents } from '../../../Documents'
import * as representatives from '@/domains/erp/identities/Clients/Tabs/Representative'

export default function UpdateRepresentative() {
  const { slidePanelState } = representatives.useRepresentative()

  return (
    <Documents Id={slidePanelState.data?.Pessoa.Id} path="representative" />
  )
}
