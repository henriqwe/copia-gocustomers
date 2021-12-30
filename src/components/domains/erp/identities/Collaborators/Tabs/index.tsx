import * as blocks from '@/blocks'

import { List as UserList } from './Users'

const sections = {
  Usuários: <UserList />
}

export default function Tabs() {
  return <blocks.Tabs categories={sections} />
}
