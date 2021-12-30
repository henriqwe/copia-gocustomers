import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as services from '@/domains/erp/commercial/Providers/Tabs/Services'

import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import {
  BRLMoneyInputDefaultFormat,
  BRLMoneyInputFormat,
  BRLMoneyUnformat
} from 'utils/formaters'
import { useEffect, useState } from 'react'

type ServiceProvider = {
  Id: string
  Tarifas: {
    Id: string
    Valor: string
    Tarifa: { Id: string; Nome: string }
  }[]
}

export default function CreateServiceTariff() {
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider>()
  const {
    createServiceTariffLoading,
    createServiceTariff,
    updateServiceTariff,
    updateServiceTariffLoading,
    setSlidePanelState,
    servicesRefetch,
    slidePanelState,
    getServiceProviderByServiceId
  } = services.useService()
  const { handleSubmit, control } = useForm()
  const onSubmit = (formData: any) => {
    try {
      if ((serviceProvider?.Tarifas.length || 0) > 0) {
        const validation = serviceProvider?.Tarifas.map((_, index) => {
          if (!formData['ValorUpdate' + index]) {
            return null
          }
        })

        if (validation?.includes(null)) {
          throw new Error('Preencha todos os campos para continuar')
        }

        serviceProvider?.Tarifas.map((tariff, index) => {
          updateServiceTariff({
            variables: {
              Id: tariff.Id,
              Valor: BRLMoneyUnformat(formData['ValorUpdate' + index])
            }
          }).then(() => {
            servicesRefetch()
            setSlidePanelState((oldState) => {
              return { ...oldState, open: false }
            })
          })
        })
        notification('Tarifa atualizada com sucesso', 'success')
        return
      }
      const validation = slidePanelState.data?.Tarifas.map((_, index) => {
        if (!formData['ValorCreate' + index]) {
          return null
        }
      })

      if (validation?.includes(null)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      slidePanelState.data?.Tarifas.map((tariff, index) => {
        createServiceTariff({
          variables: {
            Tarifa_Id: tariff.Tarifa.Id,
            Fornecedor_Servico_Id: serviceProvider?.Id,
            Valor: BRLMoneyUnformat(formData['ValorCreate' + index])
          }
        }).then(() => {
          servicesRefetch()
          setSlidePanelState((oldState) => {
            return { ...oldState, open: false }
          })
        })
      })
      notification('Tarifa cadastrada com sucesso', 'success')
    } catch (error: any) {
      showError(error)
    }
  }

  useEffect(() => {
    getServiceProviderByServiceId(slidePanelState.data?.Id).then((data) => {
      setServiceProvider(data[0])
    })
  }, [slidePanelState.data])

  if (slidePanelState.data?.Tarifas.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-10">
        <h1 className="text-lg">Sem tarifas vinculadas com esse serviço</h1>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        {(serviceProvider?.Tarifas.length || 0) > 0
          ? serviceProvider?.Tarifas.map((tariff, index) => (
              <div className="grid grid-cols-2 gap-2" key={tariff.Id}>
                <form.Select
                  itens={[]}
                  value={{
                    key: tariff.Tarifa.Id,
                    title: tariff.Tarifa.Nome
                  }}
                  onChange={() => null}
                  label="Tarifa"
                  disabled
                />

                <Controller
                  control={control}
                  name={'ValorUpdate' + index}
                  defaultValue={BRLMoneyInputDefaultFormat(
                    tariff.Valor.toString()
                  )}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <form.Input
                        fieldName={'Valor' + index}
                        title={`Valor`}
                        value={value}
                        onChange={(e) => {
                          onChange(BRLMoneyInputFormat(e))
                        }}
                        icon="R$"
                      />
                    </div>
                  )}
                />
              </div>
            ))
          : slidePanelState.data?.Tarifas?.map((tariff, index) => (
              <div className="grid grid-cols-2 gap-2" key={tariff.Id}>
                <form.Select
                  itens={[]}
                  value={{
                    key: tariff.Tarifa.Id,
                    title: tariff.Tarifa.Nome
                  }}
                  onChange={() => null}
                  label="Tarifa"
                  disabled
                />

                <Controller
                  control={control}
                  name={'ValorCreate' + index}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <form.Input
                        fieldName={'Valor' + index}
                        title={`Valor`}
                        value={value}
                        onChange={(e) => {
                          onChange(BRLMoneyInputFormat(e))
                        }}
                        icon="R$"
                      />
                    </div>
                  )}
                />
              </div>
            ))}
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Confirmar"
        disabled={createServiceTariffLoading || updateServiceTariffLoading}
        loading={createServiceTariffLoading || updateServiceTariffLoading}
      />
    </form>
  )
}
