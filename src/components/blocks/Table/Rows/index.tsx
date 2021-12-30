import * as table from '@/blocks/Table/itens'

type RowsType = {
  lines: any[]
  columns: {
    title: string
    fieldName: string
    type?: 'date' | 'relationship' | 'handler' | undefined
    handler?: (valor: string) => string
  }[]
  actions?: (item: { item: { title: string; fieldName: string } }) => string
}

export default function Rows({ lines, columns, actions }: RowsType) {
  return (
    <>
      {lines.map((item, index) => (
        <table.Row
          columns={columns}
          item={item}
          actions={actions}
          key={`table-row-${index}`}
        />
      ))}
    </>
  )
}
