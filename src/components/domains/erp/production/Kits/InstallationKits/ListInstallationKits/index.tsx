import * as installationKits from '@/domains/erp/production/Kits/InstallationKits'
import * as blocks from '@/blocks'

export default function List() {
  const { installationKitsData } = installationKits.useList()
  return installationKitsData ? (
    <blocks.Table
      colection={installationKitsData}
      columnTitles={[
        { title: 'Código de Referencia', fieldName: 'CodigoReferencia' },
        {
          title: 'Rastreador',
          fieldName: 'Rastreador',
          type: 'handler',
          handler: (rastreador) => {
            return (
              rastreador.CodigoReferencia + ' - ' + rastreador.Item.Produto.Nome
            )
          }
        },
        {
          title: 'Kit de insumo',
          fieldName: 'KitDeInsumo',
          type: 'handler',
          handler: (kitDeInsumo) => {
            return (
              kitDeInsumo.CodigoReferencia +
              ' - ' +
              kitDeInsumo.Item.Produto.Nome +
              ' - ' +
              kitDeInsumo.TiposDeKitDeInsumo.Nome
            )
          }
        }
      ]}
      actions={installationKits.RowActions}
    />
  ) : (
    <blocks.TableSkeleton />
  )
}
