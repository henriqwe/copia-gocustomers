import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as products from '@/domains/erp/commercial/Providers/Tabs/Products'

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

type ProductProvider = {
  Id: string
  Precos: { Id: string; Valor: string }[]
}

export default function CreateProductPrice() {
  const [productProvider, setProductProvider] = useState<ProductProvider>()
  const [prices, setPrices] = useState<
    {
      Id: string
      Valor: string
      created_at: Date
      TipoDeRecorrencia?: {
        Comentario: string
        Valor: string
      }
    }[]
  >([])
  const [allowRecurrenceType, setAllowRecurrenceType] = useState(false)
  const {
    createProductPriceLoading,
    createProductPrice,
    setSlidePanelState,
    productsRefetch,
    slidePanelState,
    getProductProviderByProductId,
    pricingSchema,
    recurrenceTypeData
  } = products.useProduct()
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
    TipoDeRecorrencia_Id?: { key: string }
  }) => {
    try {
      if (allowRecurrenceType && formData.TipoDeRecorrencia_Id === undefined) {
        return notification(
          'Selecione o tipo de recorrência para continuar',
          'error'
        )
      }
      createProductPrice({
        variables: {
          Fornecedor_Produto_Id: productProvider?.Id,
          TipoDeRecorrencia_Id: formData.TipoDeRecorrencia_Id
            ? formData.TipoDeRecorrencia_Id.key
            : null,
          Valor: Number(BRLMoneyUnformat(formData.Valor)).toFixed(2)
        }
      }).then(() => {
        productsRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification('Produto precificado com sucesso', 'success')
      })
    } catch (error: any) {
      showError(error)
    }
  }

  useEffect(() => {
    getProductProviderByProductId(slidePanelState.data?.Id).then((data) => {
      setProductProvider(data[0])
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
            <div className="flex items-center col-span-4 gap-4">
              <div className="flex-1 w-full">
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
                  onChange={onChange}
                  disabled={!allowRecurrenceType}
                  label="Tipo de recorrência"
                />
              </div>
              <form.Switch
                onChange={() => setAllowRecurrenceType(!allowRecurrenceType)}
                value={allowRecurrenceType}
                size="medium"
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Confirmar"
        disabled={createProductPriceLoading}
        loading={createProductPriceLoading}
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
                    {BRLMoneyFormat(Valor)} - {ptBRtimeStamp(created_at)}{' '}
                    {TipoDeRecorrencia
                      ? `- ${TipoDeRecorrencia?.Comentario}`
                      : ''}
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
