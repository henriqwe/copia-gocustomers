import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as conditionals from '@/domains/erp/commercial/Registration/Conditionals'
import * as services from '@/domains/erp/commercial/Services'
import * as plans from '@/domains/erp/commercial/Plans'
import { useEffect, useState } from 'react'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import {
  BRLMoneyFormat,
  BRLMoneyInputDefaultFormat,
  BRLMoneyInputFormat,
  BRLMoneyUnformat
} from 'utils/formaters'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

const CreatePlan = () => {
  const [conditionalsGroup, setConditionalsGroup] = useState<number[]>([1])
  const [lastNumber, setlastNumber] = useState(0)
  const [reload, setReload] = useState(false)
  const router = useRouter()

  const { servicesData } = services.useService()
  const { conditionalData } = conditionals.useConditional()
  const { createPlan, createPlanLoading, planSchema } = plans.useCreate()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(planSchema)
  })

  async function onSubmit(data: any) {
    try {
      const conditionalsValues = conditionalsGroup
        .filter((conditional) => conditional !== 0)
        .map((conditional) => {
          if (
            !data['Condicional_Id' + conditional] ||
            !data['Valor' + conditional] ||
            data['Valor' + conditional] === '' ||
            !data['Nome'] ||
            !data['Servico_Id']
          ) {
            return
          }

          return {
            Valor: BRLMoneyUnformat(data['Valor' + conditional]),
            Condicional_Id: data['Condicional_Id' + conditional].key.Id
          }
        })

      if (conditionalsValues.includes(undefined)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      const precoServico = data.Servico_Id.key.Fornecedores[0].Precos[0].Valor
      let ValorPraticado = null
      if (data.Desconto) {
        ValorPraticado = precoServico - precoServico * (data.Desconto / 100)
      }

      await createPlan({
        variables: {
          Servico_Id: data.Servico_Id.key.Id,
          Nome: data.Nome,
          ServicoPreco_Id: data.Servico_Id.key.Fornecedores[0].Precos[0].Id,
          ValorBase: Number(BRLMoneyUnformat(data.Valor)),
          ValorPraticado: Number(ValorPraticado?.toFixed(2)) || null,
          data: conditionalsValues
        }
      }).then(() => {
        router.push(rotas.erp.comercial.planos.index)
        notification('Plano criado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  function disableMainButton() {
    const itensArray: any[] = []
    conditionalsGroup.map((conditional) => {
      if (conditional !== 0) {
        itensArray.push(watch('Condicional_Id' + conditional))
        itensArray.push(watch('Valor' + conditional))
      }
    })
    if (itensArray.includes(undefined) || itensArray.includes('')) {
      return true
    }
    return (
      createPlanLoading ||
      watch('Servico_Id') === undefined ||
      watch('Servico_Id') === '' ||
      watch('Valor') === undefined ||
      watch('Valor') === ''
    )
  }

  function getTotalPrice() {
    let totalPrice = 0
    if (watch('Servico_Id')) {
      let value = watch('Servico_Id').key.Fornecedores[0].Precos[0].Valor
      if (watch('Desconto')) {
        value = value - value * (watch('Desconto') / 100)
      }
      totalPrice += Number(value.toFixed(2))
    }

    if (watch('Valor')) {
      totalPrice += Number(BRLMoneyUnformat(watch('Valor')))
    }
    return BRLMoneyFormat(totalPrice)
  }

  function getPraticePrice() {
    if (watch('Servico_Id') && watch('Desconto')) {
      const value = watch('Servico_Id').key.Fornecedores[0].Precos[0].Valor
      return BRLMoneyInputDefaultFormat(
        (value - value * (watch('Desconto') / 100)).toFixed(2)
      )
    }
  }

  useEffect(() => {
    if (conditionalsGroup[conditionalsGroup.length - 1] > lastNumber) {
      setlastNumber(conditionalsGroup[conditionalsGroup.length - 1])
    }
  }, [conditionalsGroup])

  return (
    <common.Card>
      <form>
        <div className="flex justify-between">
          <common.GenericTitle
            title="Dados do plano"
            subtitle="Serviços e Condicionais"
            className="px-6"
          />
          <p className="px-6 mt-2 text-xl">Valor Total: {getTotalPrice()}</p>
        </div>
        <common.Separator />
        <form.FormLine grid={3} position={1}>
          <Controller
            control={control}
            name="Servico_Id"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Select
                  itens={
                    servicesData
                      ? servicesData
                          .filter(
                            (service) => service.Fornecedores.length !== 0
                          )
                          .map((item) => {
                            return {
                              key: item,
                              title: item.Nome
                            }
                          })
                      : []
                  }
                  error={errors.Servico_Id}
                  value={value}
                  onChange={onChange}
                  label="Serviço"
                />
                <common.OpenModalLink
                  onClick={() => router.push(rotas.erp.comercial.servicos)}
                >
                  Cadastrar serviço
                </common.OpenModalLink>
              </div>
            )}
          />

          <div>
            <form.Input
              fieldName="Nome"
              title="Nome"
              error={errors.Nome}
              register={register}
            />
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
                watch(
                  'Servico_Id'
                )?.key.Fornecedores[0].Precos[0].Valor.toFixed(2) || '0'
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
                  disabled={watch('Servico_Id') === undefined}
                />
                <p>(opcional)</p>
              </div>
            )}
          />

          <div>
            <form.Input
              fieldName={'ValorPraticado'}
              title={`Valor praticado do serviço`}
              value={getPraticePrice()}
              disabled
              icon="R$"
            />
          </div>
        </form.FormLine>

        <div className="mt-2">
          <common.GenericTitle
            title="Dados das condicionais"
            subtitle="Condicional e Valor"
            className="px-6"
          />
          <common.Separator />
        </div>

        {conditionalsGroup.map(
          (conditionalPosition, index) =>
            conditionalPosition !== 0 && (
              <form.FormLine
                position={conditionalPosition}
                grid={9}
                key={index}
              >
                <Controller
                  name={'Condicional_Id' + conditionalPosition}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-4">
                      <form.Select
                        itens={
                          conditionalData
                            ? conditionalData.map((item) => {
                                return {
                                  key: item,
                                  title: item.Nome
                                }
                              })
                            : []
                        }
                        value={value}
                        onChange={(e) => {
                          setValue('Valor' + conditionalPosition, '')
                          onChange(e)
                        }}
                        label="Condicional"
                      />
                      <common.OpenModalLink
                        onClick={() =>
                          router.push(
                            rotas.erp.comercial.cadastros.condicionais
                          )
                        }
                      >
                        Cadastrar condicional
                      </common.OpenModalLink>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={'Valor' + conditionalPosition}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-4">
                      <form.Input
                        fieldName={'Valor' + conditionalPosition}
                        title={`Valor ${
                          watch('Condicional_Id' + conditionalPosition) !==
                          undefined
                            ? `(${
                                watch('Condicional_Id' + conditionalPosition)
                                  .key.Situacao.Comentario
                              })`
                            : ''
                        }`}
                        value={value}
                        onChange={(e) => {
                          onChange(
                            watch('Condicional_Id' + conditionalPosition).key
                              .Situacao.Comentario === 'Km'
                              ? BRLMoneyInputFormat(e)
                              : e
                          )
                        }}
                        disabled={
                          watch('Condicional_Id' + conditionalPosition) ===
                          undefined
                        }
                        type={
                          watch('Condicional_Id' + conditionalPosition)
                            ? watch('Condicional_Id' + conditionalPosition).key
                                .Situacao.Comentario === 'Km'
                              ? 'text'
                              : 'number'
                            : 'text'
                        }
                        icon="R$"
                      />
                    </div>
                  )}
                />
                {conditionalPosition !== 1 && (
                  <buttons.DeleteButton
                    onClick={() => {
                      conditionalsGroup[index] = 0
                      setReload(!reload)
                    }}
                  />
                )}
              </form.FormLine>
            )
        )}
        {!createPlanLoading && (
          <common.AddForm
            array={conditionalsGroup}
            setArray={setConditionalsGroup}
            lastNumber={lastNumber}
          >
            Adicionar outra condicional
          </common.AddForm>
        )}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Cadastrar"
          disabled={disableMainButton()}
          onClick={handleSubmit(onSubmit)}
          loading={createPlanLoading}
        />
      </div>
    </common.Card>
  )
}

export default CreatePlan
