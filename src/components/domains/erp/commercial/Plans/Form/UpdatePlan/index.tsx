import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as plans from '@/domains/erp/commercial/Plans'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import {
  BRLMoneyFormat,
  BRLMoneyInputDefaultFormat,
  BRLMoneyInputFormat,
  BRLMoneyUnformat
} from 'utils/formaters'
import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

const UpdatePlan = () => {
  const [positionsArray, setPositionsArray] = useState<number[]>([])
  const [firstLoad, setFirstLoad] = useState(true)
  const router = useRouter()

  const {
    plansData,
    createPlanPrice,
    createPlanPriceLoading,
    updatePlan,
    updatePlanLoading,
    updateCondicionalPlan,
    updateCondicionalPlanLoading,
    deleteCondicionalPlan,
    deleteCondicionalPlanLoading,
    plansRefetch,
    planSchema
  } = plans.useUpdate()
  const { control, handleSubmit, watch, setValue, register } = useForm({
    resolver: yupResolver(planSchema)
  })
  async function onSubmit(data: any) {
    try {
      const conditionalsValues = positionsArray.map((position, index) => {
        if (
          !data['Valor' + positionsArray[index]] ||
          !!plansData?.Condicionais[index].deleted_at ||
          !data['Nome'] ||
          !data['Valor']
        ) {
          return
        }

        return {
          Id: plansData?.Condicionais[index].Id,
          Valor: Number(
            BRLMoneyUnformat(data['Valor' + positionsArray[index]])
          ).toFixed(2)
        }
      })

      if (conditionalsValues?.includes(undefined)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      conditionalsValues?.map(async (conditional) => {
        await updateCondicionalPlan({
          variables: {
            Id: conditional?.Id,
            Valor: conditional?.Valor
          }
        })
      })

      if (
        data.Valor !==
          BRLMoneyInputDefaultFormat(
            plansData?.Precos?.[0].ValorBase?.toString() as string
          ) ||
        data.ValorPraticado !==
          BRLMoneyInputDefaultFormat(
            plansData?.Precos?.[0].ValorPraticado?.toString() as string
          )
      ) {
        await createPlanPrice({
          variables: {
            ValorPraticado: data.ValorPraticado
              ? Number(BRLMoneyUnformat(data.ValorPraticado)).toFixed(2)
              : null,
            ServicoPreco_Id: plansData?.Precos[0].ServicoPreco.Id,
            ValorBase: Number(BRLMoneyUnformat(data.Valor)).toFixed(2)
          }
        })
      }
      await updatePlan({
        variables: {
          Nome: data.Nome
        }
      }).then(() => {
        router.push(rotas.erp.comercial.planos.index)
        notification('Plano editado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  async function deleteConditional(Id: string, index: number) {
    await deleteCondicionalPlan({
      variables: { Id }
    }).then(() => {
      const array = positionsArray.filter((_, position) => position !== index)
      setPositionsArray(array)
      plansRefetch()
      positionsArray.map((position, index) => {
        setValue('Valor' + position, plansData?.Condicionais[index].Valor)
      })
      notification('Condicional deletado com sucesso', 'success')
    })
  }

  function disableMainButton() {
    const itensArray: any[] = []
    positionsArray.map((position) => {
      itensArray.push(watch('Valor' + position))
    })
    if (itensArray.includes('')) {
      return true
    }
    return (
      updatePlanLoading ||
      updateCondicionalPlanLoading ||
      createPlanPriceLoading ||
      watch('Valor') === undefined ||
      watch('Valor') === '' ||
      watch('Nome') === undefined ||
      watch('Nome') === ''
    )
  }

  function getDefaultValue(index: number) {
    if (
      plansData?.Condicionais[index].Condicional.Situacao.Comentario === 'Km'
    ) {
      return BRLMoneyInputDefaultFormat(
        plansData?.Condicionais[index].Valor.toString() as string
      )
    }

    return plansData?.Condicionais[index].Valor.toString() as string
  }

  function getTotalValue() {
    let price = 0
    if (watch('ValorPraticado')) {
      price += Number(BRLMoneyUnformat(watch('ValorPraticado')))
    }
    if (watch('Valor')) {
      price += Number(BRLMoneyUnformat(watch('Valor').toString()))
    }

    return BRLMoneyFormat(price)
  }

  function getPraticePriceValue() {
    let price = 0

    if (watch('Valor')) {
      price += Number(
        BRLMoneyUnformat(
          plansData?.Precos[0].ServicoPreco.Valor.toString() as string
        )
      )
    }

    if (watch('Desconto')) {
      price = price - price * (watch('Desconto') / 100)
    }

    if (price.toString() === plansData?.Precos[0].ValorPraticado) {
      return setValue(
        'ValorPraticado',
        BRLMoneyInputDefaultFormat(plansData?.Precos[0].ValorPraticado)
      )
    }

    return setValue(
      'ValorPraticado',
      BRLMoneyInputDefaultFormat(price.toFixed(2))
    )
  }

  useEffect(() => {
    if (watch('Desconto')) {
      getPraticePriceValue()
    }
  }, [watch('Desconto')])

  useEffect(() => {
    if (positionsArray.length === 0) {
      const array: number[] = []
      plansData?.Condicionais.map((_, index) => {
        array.push(index)
      })
      setPositionsArray(array)
    }
  }, [plansData])

  useEffect(() => {
    if (firstLoad && plansData) {
      setFirstLoad(false)
      setValue(
        'Valor',
        BRLMoneyInputDefaultFormat(
          plansData?.Precos?.[0].ValorBase.toString() as string
        )
      )
      if (plansData.Precos[0].ValorPraticado) {
        setValue(
          'Desconto',
          (
            100 -
            (Number(plansData.Precos[0].ValorPraticado) * 100) /
              Number(plansData?.Precos[0].ServicoPreco.Valor)
          ).toFixed()
        )
      }

      setValue('Nome', plansData.Nome)
    }
  }, [plansData])

  return (
    <common.Card>
      <form>
        <div className="flex justify-between">
          <common.GenericTitle
            title="Dados do plano"
            subtitle="Serviços e Condicionais"
            className="px-6"
          />
          <p className="px-6 mt-2 text-xl">Valor Total: {getTotalValue()}</p>
        </div>
        <common.Separator />
        <form.FormLine grid={3} position={1}>
          <form.Select
            itens={[]}
            value={{
              key: plansData?.Servico.Id || '',
              title: plansData?.Servico.Nome || ''
            }}
            onChange={() => null}
            disabled
            label="Serviço"
          />
          <div>
            <form.Input fieldName="Nome" title="Nome" register={register} />
          </div>
          <Controller
            control={control}
            name={'Valor'}
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Input
                  fieldName={'Valor'}
                  title={`Preço`}
                  value={value}
                  onChange={(e) => {
                    onChange(BRLMoneyInputFormat(e))
                  }}
                  icon="R$"
                />
              </div>
            )}
          />

          <div>
            <form.Input
              fieldName={'ValorServico'}
              title={`Valor do serviço`}
              value={BRLMoneyInputDefaultFormat(
                Number(plansData?.Precos[0].ServicoPreco.Valor).toFixed(2) ||
                  '0'
              )}
              icon="R$"
              disabled
            />
          </div>

          <Controller
            control={control}
            name="Desconto"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Input
                  fieldName="Desconto"
                  title="Desconto do serviço em %"
                  type="number"
                  onChange={(e) => {
                    if (
                      Number(e.target.value) >= 0 &&
                      Number(e.target.value) <= 100
                    ) {
                      onChange(e)
                    }
                  }}
                  value={value}
                />
                <p>(opcional)</p>
              </div>
            )}
          />

          <div>
            <Controller
              control={control}
              name="ValorPraticado"
              render={({ field: { value } }) => (
                <form.Input
                  fieldName={'ValorPraticado'}
                  title={`Valor praticado do serviço`}
                  value={value}
                  disabled
                  icon="R$"
                />
              )}
            />
          </div>
        </form.FormLine>

        <div className="mt-2">
          <common.GenericTitle
            title="Dados das condicionais"
            subtitle="Pergunta e Resposta"
            className="px-6"
          />
          <common.Separator />
        </div>

        {positionsArray.map((position, index) => (
          <form.FormLine position={index} grid={7} key={index}>
            <div className="col-span-3">
              <form.Select
                itens={[]}
                value={{
                  key: plansData?.Condicionais[index].Condicional.Id as string,
                  title: plansData?.Condicionais[index].Condicional
                    .Nome as string
                }}
                onChange={() => null}
                disabled
                label="Condicional"
              />
            </div>

            <Controller
              control={control}
              name={'Valor' + position}
              defaultValue={getDefaultValue(index)}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-3">
                  <form.Input
                    fieldName={'Valor' + position}
                    title={`Valor ${`(${plansData?.Condicionais[index].Condicional.Situacao.Comentario})`}`}
                    value={value}
                    onChange={(e) => {
                      onChange(
                        plansData?.Condicionais[index].Condicional.Situacao
                          .Comentario === 'Km'
                          ? BRLMoneyInputFormat(e)
                          : e
                      )
                    }}
                    type={
                      plansData?.Condicionais[index].Condicional.Situacao
                        .Comentario === 'Km'
                        ? 'text'
                        : 'number'
                    }
                    icon="R$"
                  />
                </div>
              )}
            />

            <div>
              <buttons.DeleteButton
                onClick={() =>
                  deleteConditional(
                    plansData?.Condicionais[index].Id as string,
                    index
                  )
                }
                disabled={deleteCondicionalPlanLoading}
                loading={deleteCondicionalPlanLoading}
              />
            </div>
          </form.FormLine>
        ))}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Confirmar"
          disabled={disableMainButton()}
          onClick={handleSubmit(onSubmit)}
          loading={
            updatePlanLoading ||
            updateCondicionalPlanLoading ||
            createPlanPriceLoading
          }
        />
      </div>
    </common.Card>
  )
}

export default UpdatePlan
