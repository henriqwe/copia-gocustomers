import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as outgoingOrders from '@/domains/erp/outgoingOrders'

import { ptBRtimeStamp } from 'utils/formaters'
import * as blocks from '@/blocks'
import { notification } from 'utils/notification'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useEffect, useState } from 'react'
import { showError } from 'utils/showError'

const UpdateOutgoingOrder = () => {
  const [date, setDate] = useState('')
  const {
    setSlidePanelState,
    slidePanelState,
    outgoingOrderData,
    outgoingOrderProductsData,
    declineOutgoingOrderLoading,
    declineOutgoingOrder,
    outgoingOrderRefetch,
    declineSchema,
    buttonName,
    setButtonName,
    outgoingOrderLogsRefetch
  } = outgoingOrders.useUpdate()

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm({ resolver: yupResolver(declineSchema) })

  async function DeclineOutgoingOrder(formData: { MotivoRecusado: string }) {
    await declineOutgoingOrder({
      variables: {
        Id: outgoingOrderData?.Id,
        MotivoRecusado: formData.MotivoRecusado
      }
    })
      .then(() => {
        outgoingOrderRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, showModal: false }
        })
        notification('Pedido recusado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  function loadButtonName() {
    switch (outgoingOrderData?.Situacao.Comentario) {
      case 'Autorizado':
        setButtonName('Receber')
        break
      case 'Entrada parcial':
        setButtonName('Receber')
        break
      case 'Entregue':
        setButtonName('Receber')
        break
      case 'Recebido':
        setButtonName('Recebido')
        break
      case 'Recusado':
        setButtonName('Recusado')
        break
      default:
        setButtonName('Autorizar')
        break
    }
  }

  function loadDate() {
    if (outgoingOrderData?.DataRecebido) {
      setDate(ptBRtimeStamp(outgoingOrderData?.DataRecebido as Date))
      return
    }
    if (outgoingOrderData?.DataEntregue) {
      setDate(ptBRtimeStamp(outgoingOrderData?.DataEntregue as Date))
      return
    }
    if (outgoingOrderData?.DataAutorizacao) {
      setDate(ptBRtimeStamp(outgoingOrderData?.DataAutorizacao as Date))
      return
    }

    setDate(ptBRtimeStamp(outgoingOrderData?.DataAbertura as Date))
  }

  function disableMainButton() {
    return (
      outgoingOrderData?.Situacao.Comentario === 'Recebido' ||
      outgoingOrderData?.Situacao.Comentario === 'Recusado' ||
      outgoingOrderData?.Situacao.Comentario === 'Autorizado' ||
      outgoingOrderData?.Situacao.Comentario === 'Entrada parcial'
    )
  }

  const pluralFormat = (quantidade: number, valor: string) =>
    quantidade > 1 ? `${valor}s` : valor

  useEffect(() => {
    loadButtonName()
    loadDate()
    outgoingOrderLogsRefetch()
  }, [outgoingOrderData])

  return (
    <common.Card>
      <common.GenericTitle
        title="Dados do pedido"
        subtitle={`${outgoingOrderData?.Situacao.Comentario} - ${date}`}
        className="px-6"
      />
      <common.Separator className="mb-0" />
      <div>
        <blocks.DataList
          data={
            outgoingOrderProductsData
              ? outgoingOrderProductsData.map((produto) => {
                  return {
                    title: produto.Produto.Nome,
                    value: (
                      <div className="flex justify-between w-full gap-4 px-14">
                        {/* {item.Produto.UnidadeDeMedida_Id}s */}
                        <div className="w-full">
                          <p className="text-gray-500">Detalhes:</p>
                          <common.Separator />
                          <ul className="w-full">
                            <li className="flex justify-between">
                              <span>Solicitada:</span>
                              <span>
                                {ptBRtimeStamp(
                                  outgoingOrderData?.DataAbertura as Date
                                )}
                              </span>
                              <span>
                                {produto.QuantidadePedida}{' '}
                                {pluralFormat(
                                  produto.QuantidadePedida,
                                  produto.Produto.UnidadeDeMedida_Id
                                )}
                              </span>
                            </li>
                            {produto.QuantidadeAutorizada && (
                              <li className="flex justify-between">
                                <span>Autorizada:</span>
                                <span>
                                  {ptBRtimeStamp(
                                    outgoingOrderData?.DataAutorizacao as Date
                                  )}
                                </span>
                                <span>
                                  {produto.QuantidadeAutorizada}{' '}
                                  {pluralFormat(
                                    produto.QuantidadeAutorizada,
                                    produto.Produto.UnidadeDeMedida_Id
                                  )}
                                </span>
                              </li>
                            )}
                            {produto.QuantidadeEntregue && (
                              <li className="flex justify-between">
                                <span>Entregue:</span>
                                <span>
                                  {ptBRtimeStamp(
                                    outgoingOrderData?.DataEntregue as Date
                                  )}
                                </span>
                                <span>
                                  {produto.QuantidadeEntregue}{' '}
                                  {pluralFormat(
                                    produto.QuantidadeEntregue,
                                    produto.Produto.UnidadeDeMedida_Id
                                  )}
                                </span>
                              </li>
                            )}
                            {produto.QuantidadeRecebida && (
                              <li className="flex justify-between">
                                <span>Recebida:</span>
                                <span>
                                  {ptBRtimeStamp(
                                    outgoingOrderData?.DataRecebido as Date
                                  )}
                                </span>
                                <span>
                                  {produto.QuantidadeRecebida}{' '}
                                  {pluralFormat(
                                    produto.QuantidadeRecebida,
                                    produto.Produto.UnidadeDeMedida_Id
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
                            { <li>Solicitado: {produto.Fabricante.Nome} </li> }
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
          {outgoingOrderData?.Situacao.Comentario === 'Aberto' && (
            <buttons.CancelButton
              onClick={() =>
                setSlidePanelState((oldState) => {
                  return { ...oldState, showModal: true }
                })
              }
              title="Recusar"
            />
          )}

          <buttons.PrimaryButton
            title={buttonName}
            type="button"
            disabled={disableMainButton()}
            onClick={() => {
              if (buttonName === 'Autorizar') {
                setSlidePanelState((oldState) => {
                  return { ...oldState, open: true, type: 'authorize' }
                })
                return
              }

              setSlidePanelState((oldState) => {
                return { ...oldState, open: true, type: 'receive' }
              })
            }}
          />
        </div>
      </div>
      <common.Modal
        handleSubmit={handleSubmit(DeclineOutgoingOrder)}
        open={slidePanelState.showModal && slidePanelState.type === 'decline'}
        disabled={declineOutgoingOrderLoading}
        description="Deseja mesmo recusar esse pedido?"
        onClose={() =>
          setSlidePanelState((oldState) => {
            return { ...oldState, showModal: false }
          })
        }
        buttonTitle="Recusar pedido"
        modalTitle="Recusar pedido de saída?"
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

export default UpdateOutgoingOrder
