import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as services from '@/domains/erp/commercial/Providers/Tabs/Services'

import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import {
  BRLMoneyFormat,
  BRLMoneyInputDefaultFormat,
  BRLMoneyInputFormat,
  BRLMoneyUnformat,
  ptBRtimeStamp
} from 'utils/formaters'
import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

type ServiceProvider = {
  Id: string
  Precos: { Id: string; Valor: string }[]
}

export default function CreateServicePrice() {
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider>()
  const [prices, setPrices] = useState<
    {
      Id: string
      Valor: string
      created_at: Date
      TipoDeRecorrencia: {
        Valor: string
        Comentario: string
      }
    }[]
  >([])
  const {
    createServicePriceLoading,
    createServicePrice,
    setSlidePanelState,
    servicesRefetch,
    slidePanelState,
    getServiceProviderByServiceId,
    pricingSchema,
    recurrenceTypeData
  } = services.useService()
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(pricingSchema)
  })
  const onSubmit = (formData: {
    Valor: string
    TipoDeRecorrencia_Id: { key: string }
  }) => {
    try {
      createServicePrice({
        variables: {
          Fornecedor_Servico_Id: serviceProvider?.Id,
          TipoDeRecorrencia_Id: formData.TipoDeRecorrencia_Id.key,
          Valor: Number(BRLMoneyUnformat(formData.Valor)).toFixed(2)
        }
      }).then(() => {
        servicesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Serviço precificado com sucesso', 'success')
      })
    } catch (error: any) {
      showError(error)
    }
  }

  useEffect(() => {
    getServiceProviderByServiceId(slidePanelState.data?.Id).then((data) => {
      setServiceProvider(data[0])
      if (data[0].Precos.length > 0) {
        setValue(
          'Valor',
          BRLMoneyInputDefaultFormat(data[0].Precos[0].Valor.toString())
        )
        setPrices(data[0].Precos)
      }
    })
  }, [slidePanelState.data])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          control={control}
          name={'Valor'}
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Input
                fieldName={'Valor'}
                title={`Valor`}
                value={value}
                onChange={(e) => {
                  onChange(BRLMoneyInputFormat(e))
                }}
                error={errors.Valor}
                icon="R$"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name={'TipoDeRecorrencia_Id'}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-4">
              <form.Select
                itens={
                  recurrenceTypeData
                    ? recurrenceTypeData.map((recurrenceType) => {
                        return {
                          key: recurrenceType.Valor,
                          title: recurrenceType.Comentario
                        }
                      })
                    : []
                }
                value={value}
                error={errors.TipoDeRecorrencia_Id}
                onChange={onChange}
                label="Tipo de recorrência"
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Confirmar"
        disabled={createServicePriceLoading}
        loading={createServicePriceLoading}
      />
      <div className="w-full">
        {prices.length > 0 ? (
          <>
            <common.Separator />
            <h2 className="mb-2 text-xl">Últimos preços</h2>

            <ol>
              {prices.map(({ Valor, Id, created_at, TipoDeRecorrencia }) => (
                <div key={Id}>
                  <li className="list-disc list-item">
                    {BRLMoneyFormat(Valor)} - {ptBRtimeStamp(created_at)} -{' '}
                    {TipoDeRecorrencia.Comentario}
                  </li>
                </div>
              ))}
            </ol>
          </>
        ) : null}
      </div>
    </form>
  )
}
