import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as blocks from '@/blocks'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import { BRLMoneyFormat } from 'utils/formaters'

export default function List() {
  const { budgetsData, setSlidePanelState, providersData } =
    purchaseOrders.budgets.useBudget()
  const { purchaseOrderData } = purchaseOrders.useUpdate()

  function showButton() {
    return (
      purchaseOrderData?.DataAutorizacao === null &&
      purchaseOrderData?.MotivoRecusado === null
    )
  }

  return budgetsData ? (
    <div>
      {showButton() && (
        <div className="flex justify-end w-full mt-5">
          <buttons.SecondaryButton
            handler={() => {
              setSlidePanelState({
                open: true,
                type: 'create',
                showModal: false
              })
            }}
          />
        </div>
      )}
      <common.Separator />
      <blocks.Table
        colection={budgetsData}
        columnTitles={[
          {
            title: 'Fornecedor',
            fieldName: 'Fornecedor_Id',
            type: 'handler',
            handler: (valor) => {
              const provider = providersData?.filter(
                (item) => item.Id === valor
              )
              return provider?.[0].Pessoa.Nome as string
            }
          },
          {
            title: 'Valor total',
            fieldName: 'Orcamentos_Produtos',
            type: 'handler',
            handler: (orcamento) => {
              const valores = orcamento.map(
                (item: { Quantidade: number; ValorUnitario: number }) => {
                  return item.Quantidade * item.ValorUnitario
                }
              )
              const reducer = (accumulator: number, curr: number) =>
                accumulator + curr

              return BRLMoneyFormat(valores.reduce(reducer) as string)
            }
          }
        ]}
        actions={purchaseOrders.budgets.RowActions}
      />
      <purchaseOrders.budgets.SlidePanel />
    </div>
  ) : (
    <blocks.TableSkeleton />
  )
}
