import * as blocks from '@/blocks'

import LogsList from './LogsList'
import { List as UserList } from './Users'
import { List as EmailsList } from './Emails'
import { List as AddressesList } from './Addresses'
import { List as PhonesList } from './Phones'
import { List as RepresentativeList } from './Representative'
import { Documents as Documents } from './Documents'

const sections = {
  Usuários: <UserList />,
  Endereços: <AddressesList />,
  Emails: <EmailsList />,
  Telefones: <PhonesList />,
  Documentos: <Documents />,
  Representantes: <RepresentativeList />,
  Logs: <LogsList />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
