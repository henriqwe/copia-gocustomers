import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import * as common from '@/common'
import * as form from '@/common/Form'
import * as buttons from '@/common/Buttons'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'
import * as providers from '@/domains/erp/identities/Providers'
import { notification } from 'utils/notification'
import { BRLMoneyUnformat, BRLMoneyInputFormat } from 'utils/formaters'
import rotas from '@/domains/routes'
import { useRouter } from 'next/router'
import { showError } from 'utils/showError'

export default function CreateBudget() {
  const router = useRouter()
  const {
    setSlidePanelState,
    createBudget,
    createBudgetLoading,
    budgetsRefetch,
    budgetsData,
    budgetSchema
  } = purchaseOrders.budgets.useBudget()
  const { purchaseOrderProductsData, budgetPurchaseOrder, purchaseOrderData } =
    purchaseOrders.useUpdate()
  // const { fabricantesData } = fabricante.useFabricante()
  const { providersData } = providers.useList()
  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(budgetSchema)
  })

  const onSubmit = (formData: any) => {
    try {
      const valoresDosProdutos = purchaseOrderProductsData?.map(
        (item, index) => {
          if (!formData['valor' + index] || formData['valor' + index] == 0) {
            throw new Error('Digite um valor acima de 0')
          }
          if (!formData['quantidade' + index]) {
            throw new Error('Preencha todos os campos para continuar')
          }

          return {
            Quantidade: formData['quantidade' + index],
            PedidosDeCompra_Produto_Id: item.Id,
            // Fabricante_Id: formData['fabricante' + index].key,
            ValorUnitario: BRLMoneyUnformat(formData['valor' + index]),
            Descricao: formData['descricao' + index]
              ? formData['descricao' + index]
              : null
          }
        }
      )

      createBudget({
        variables: {
          Fornecedor_Id: formData.Fornecedor_Id.key,
          data: valoresDosProdutos
        }
      }).then(() => {
        budgetsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Orçamento cadastrado com sucesso', 'success')

        if (
          budgetsData?.length === 0 &&
          purchaseOrderData?.DataOrcamento === null
        ) {
          budgetPurchaseOrder({
            variables: {
              Id: purchaseOrderData?.Id
            }
          }).then(() => {
            budgetsRefetch()
          })
        }
      })
    } catch (err: any) {
      showError(err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          control={control}
          name="Fornecedor_Id"
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <form.Select
                itens={
                  providersData
                    ? providersData.map((item) => {
                        return {
                          key: item.Id,
                          title: item.Pessoa?.Nome as string
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Fornecedor_Id}
                label="Fornecedor"
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.identidades.fornecedores.cadastrar)
                }
              >
                Cadastrar Fornecedor
              </common.OpenModalLink>
            </div>
          )}
        />
        <common.Separator />
        {purchaseOrderProductsData?.map((produto, index) => (
          <div key={index}>
            <common.TitleWithSubTitleAtTheTop
              title={produto.Produto.Nome + ' - ' + produto.Descricao}
              subtitle="Nome do produto"
            />

            <div className="grid w-full grid-cols-2 gap-3">
              {/* <Controller
                control={control}
                defaultValue={{
                  key: produto.Fabricante.Id,
                  titulo: produto.Fabricante.Nome
                }}
                name={'fabricante' + index}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <common.Select
                      items={
                        fabricantesData
                          ? fabricantesData.estoque_Fabricantes.map((item) => {
                              return {
                                key: item.Id,
                                titulo: item.Nome
                              }
                            })
                          : []
                      }
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                )}
              /> */}
              <Controller
                control={control}
                name={'quantidade' + index}
                defaultValue={produto.QuantidadePedida}
                render={({
                  field: { onChange, value = produto.QuantidadePedida }
                }) => (
                  <div>
                    <form.Input
                      fieldName={'quantidade' + index}
                      title="Quantidade"
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name={'valor' + index}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <form.Input
                      fieldName={'valor' + index}
                      title="Valor unitário (R$)"
                      value={value}
                      onChange={(e) => {
                        onChange(BRLMoneyInputFormat(e))
                      }}
                      icon="R$"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                defaultValue={produto.Descricao}
                name={'descricao' + index}
                render={({ field: { onChange, value } }) => (
                  <div className="col-span-2">
                    <form.Input
                      fieldName={'descricao' + index}
                      title="Descrição"
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <common.Separator />

      <buttons.PrimaryButton
        title="Cadastrar"
        disabled={createBudgetLoading}
        loading={createBudgetLoading}
      />
    </form>
  )
}
