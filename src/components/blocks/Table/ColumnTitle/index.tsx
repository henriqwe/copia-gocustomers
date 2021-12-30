type ColumnTitleProps = {
  columns: { title: string; fieldName: string }[]
  disableActions: boolean
}

export default function ColumnTitle({
  columns = [],
  disableActions
}: ColumnTitleProps) {
  return (
    <tr>
      {columns.length ? (
        columns.map((item, index) => (
          <th key={`table-title-${index}`} className="whitespace-nowrap">
            {item.title}
          </th>
        ))
      ) : (
        <th className="whitespace-nowrap">Sem colunas</th>
      )}
      {!disableActions && (
        <th className="text-center whitespace-nowrap" data-testid="semações">
          Ações
        </th>
      )}
    </tr>
  )
}
