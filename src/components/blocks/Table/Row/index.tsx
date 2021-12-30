import * as table from '@/blocks/Table/itens'
import { ptBRtimeStamp } from 'utils/formaters'

type RowProps = {
  actions?: (item: { item: { title: string; fieldName: string } }) => void
  columns: {
    title: string
    fieldName: string
    type?: 'date' | 'relationship' | 'handler' | undefined
    relationshipName?: string
    handler?: (valor: string) => string
  }[]
  item: any
}

export default function Row({ columns, item, actions }: RowProps) {
  return (
    <tr className="intro-x" data-testid="linha">
      {columns.map((coluna, index) => {
        if (coluna.type === 'date') {
          return (
            <table.Field
              key={`table-cell-${index}`}
              value={ptBRtimeStamp(item[coluna.fieldName])}
            />
          )
        }
        if (coluna.type === 'relationship') {
          return (
            <table.Field
              key={`table-cell-${index}`}
              value={item[coluna.relationshipName as string][coluna.fieldName]}
            />
          )
        }
        if (coluna.type === 'handler' && coluna.handler) {
          return (
            <table.Field
              key={`table-cell-${index}`}
              value={coluna.handler(item[coluna.fieldName as string])}
            />
          )
        }
        if (coluna.type === undefined) {
          return (
            <table.Field
              key={`table-cell-${index}`}
              value={item[coluna.fieldName]}
            />
          )
        }
      })}
      {actions && actions({ item: item })}
    </tr>
  )
}
