import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as blocks from '@/blocks'
import * as purchaseOrders from '@/domains/erp/purchases/PurchaseOrders'

import { ptBRtimeStamp } from 'utils/formaters'
import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { useRouter } from 'next/router'
import rotas from '@/domains/routes'
import { showError } from 'utils/showError'

const UpdatePurchaseOrder = () => {
  const router = useRouter()
  const [date, setDate] = useState('')
  const {
    purchaseOrderData,
    purchaseOrderRefetch,
    purchaseOrderProductsData,
    setSlidePanelState,
    slidePanelState,
    buttonName,
    setButtonName,
    declineSchema,
    declinePurchaseOrder,
    declinePurchaseOrderLoading,
    purchaseOrderLogsRefetch
  } = purchaseOrders.useUpdate()

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm({ resolver: yupResolver(declineSchema) })

  async function DeclinePurchaseOrder(formData: { MotivoRecusado: string }) {
    await declinePurchaseOrder({
      variables: {
        Id: purchaseOrderData?.Id,
        MotivoRecusado: formData.MotivoRecusado
      }
    })
      .then(() => {
        purchaseOrderRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, showModal: false }
        })
        router.push(rotas.erp.compras.pedidos.index)
        notification('Pedido recusado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  useEffect(() => {
    if (purchaseOrderData) {
      loadDate()
      if (purchaseOrderData.Situacao.Comentario === 'Finalizado') {
        setButtonName('Finalizado')
        return
      }
      if (purchaseOrderData.Situacao.Comentario === 'Recusado') {
        setButtonName('Recusado')
        return
      }
      if (purchaseOrderData.Situacao.Comentario === 'Comprado') {
        setButtonName('Registrar recebimento')
        return
      }
      if (purchaseOrderData.Situacao.Comentario === 'Recebido') {
        setButtonName('Registrar movimentação')
        return
      }

      setButtonName('Informar compra')
    }
    purchaseOrderLogsRefetch()
  }, [purchaseOrderData])

  function loadDate() {
    if (purchaseOrderData?.DataEntrada) {
      setDate(ptBRtimeStamp(purchaseOrderData?.DataEntrada as Date))
      return
    }
    if (purchaseOrderData?.DataEntregue) {
      setDate(ptBRtimeStamp(purchaseOrderData?.DataEntregue as Date))
      return
    }
    if (purchaseOrderData?.DataCompra) {
      setDate(ptBRtimeStamp(purchaseOrderData?.DataCompra as Date))
      return
    }
    if (purchaseOrderData?.DataAutorizacao) {
      setDate(ptBRtimeStamp(purchaseOrderData?.DataAutorizacao as Date))
      return
    }
    if (purchaseOrderData?.DataOrcamento) {
      setDate(ptBRtimeStamp(purchaseOrderData?.DataOrcamento as Date))
      return
    }
    setDate(ptBRtimeStamp(purchaseOrderData?.DataAbertura as Date))
  }

  function openSlidePanel() {
    if (buttonName === 'Informar compra') {
      setSlidePanelState({ open: true, type: 'buy', showModal: false })
      return
    }
    if (buttonName === 'Registrar recebimento') {
      setSlidePanelState({ open: true, type: 'deliver', showModal: false })
      return
    }
    if (buttonName === 'Registrar movimentação') {
      router.push(
        rotas.erp.estoque.movimentacoes.entradas.index + '/' + router.query.id
      )
      return
    }
  }

  function showButton() {
    return purchaseOrderData?.Situacao.Comentario !== 'Aberto'
  }

  function disableButton() {
    return (
      !!purchaseOrderData?.MotivoRecusado ||
      purchaseOrderData?.Situacao.Comentario === 'Finalizado'
    )
  }

  const pluralFormat = (amount: number, value: string) =>
    amount > 1 ? `${value}s` : value

  return (
    <common.Card>
      <common.GenericTitle
        title="Dados do pedido"
        className="px-6"
        subtitle={
          <>
            <p>
              {purchaseOrderData?.Situacao.Comentario} - {date}
            </p>
            {purchaseOrderData?.MotivoRecusado && (
              <p>Motivo da recusa: {purchaseOrderData?.MotivoRecusado}</p>
            )}
            {purchaseOrderData?.TipoPagamento && (
              <p>Forma de pagamento: {purchaseOrderData?.TipoPagamento}</p>
            )}
          </>
        }
      />
      <common.Separator className="mb-0" />
      <div>
        <blocks.DataList
          data={
            purchaseOrderProductsData
              ? purchaseOrderProductsData.map((item) => {
                  return {
                    title: item.Produto.Nome,
                    value: (
                      <div className="flex justify-between w-full gap-4 px-14">
                        {/* {item.Produto.UnidadeDeMedida_Id}s */}
                        <div className="w-full">
                          <p className="text-gray-500">Detalhes:</p>
                          <common.Separator />
                          <ul>
                            <li className="flex justify-between">
                              <span>Solicitada:</span>
                              <span>
                                {ptBRtimeStamp(
                                  purchaseOrderData?.DataAbertura as Date
                                )}
                              </span>
                              <span>
                                {item.QuantidadePedida}{' '}
                                {pluralFormat(
                                  item.QuantidadePedida,
                                  item.Produto.UnidadeDeMedida_Id
                                )}
                              </span>
                            </li>

                            {item.QuantidadeAutorizada && (
                              <li className="flex justify-between">
                                <span>Autorizada:</span>
                                <span>
                                  {ptBRtimeStamp(
                                    purchaseOrderData?.DataAutorizacao as Date
                                  )}
                                </span>
                                <span>
                                  {item.QuantidadeAutorizada}{' '}
                                  {pluralFormat(
                                    item.QuantidadeAutorizada,
                                    item.Produto.UnidadeDeMedida_Id
                                  )}
                                </span>
                              </li>
                            )}
                            {item.QuantidadeComprada && (
                              <li className="flex justify-between">
                                <span>Comprada:</span>
                                <span>
                                  {ptBRtimeStamp(
                                    purchaseOrderData?.DataCompra as Date
                                  )}
                                </span>
                                <span>
                                  {item.QuantidadeComprada}{' '}
                                  {pluralFormat(
                                    item.QuantidadeComprada,
                                    item.Produto.UnidadeDeMedida_Id
                                  )}
                                </span>
                              </li>
                            )}
                            {item.QuantidadeEntregue && (
                              <li className="flex justify-between">
                                <span>Recebido:</span>
                                <span>
                                  {ptBRtimeStamp(
                                    purchaseOrderData?.DataEntregue as Date
                                  )}
                                </span>
                                <span>
                                  {item.QuantidadeEntregue}{' '}
                                  {pluralFormat(
                                    item.QuantidadeEntregue,
                                    item.Produto.UnidadeDeMedida_Id
                                  )}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                        {/* <div className="w-full">
                          <p className="text-gray-500">Fabricante:</p>
                          <common.Separator />
                          <ul>
                            <li>Solicitado: {item.Fabricante.Nome} </li>
                          </ul>
                        </div> */}
                      </div>
                    )
                  }
                })
              : []
          }
        />
      </div>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />

        <div className="flex justify-end w-full gap-2">
          {purchaseOrderData?.Situacao.Comentario === 'Aberto' && (
            <buttons.CancelButton
              onClick={() =>
                setSlidePanelState((oldState) => {
                  return { ...oldState, type: 'decline', showModal: true }
                })
              }
              title="Recusar"
            />
          )}
          {showButton() && (
            <buttons.PrimaryButton
              disabled={disableButton()}
              loading={false}
              type="button"
              onClick={openSlidePanel}
              title={buttonName}
            />
          )}
        </div>
      </div>
      <common.Modal
        handleSubmit={handleSubmit(DeclinePurchaseOrder)}
        open={slidePanelState.showModal && slidePanelState.type === 'decline'}
        disabled={declinePurchaseOrderLoading}
        description="Deseja mesmo recusar esse pedido?"
        onClose={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: false }
          })
        }
        buttonTitle="Recusar pedido"
        modalTitle="Recusar pedido de compra?"
        color="red"
      >
        <div className="my-2">
          <form.Input
            fieldName="MotivoRecusado"
            title="Motivo da recusa"
            register={register}
            error={errors.MotivoRecusado}
          />
        </div>
      </common.Modal>
    </common.Card>
  )
}

export default UpdatePurchaseOrder
