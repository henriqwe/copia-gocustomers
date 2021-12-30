import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as services from '@/domains/erp/commercial/Services'
import { useEffect, useState } from 'react'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import {
  BRLMoneyFormat,
  BRLMoneyInputDefaultFormat,
  BRLMoneyInputFormat,
  BRLMoneyUnformat
} from 'utils/formaters'

type SelectItem = {
  key: any
  title: string
}

const CreateCombo = () => {
  const [itensGroup, setItensGroup] = useState<number[]>([1])
  const [plansArray, setPlansArray] = useState<SelectItem[]>([])
  const [productsArray, setProductsArray] = useState<SelectItem[]>([])
  const [servicesArray, setServicesArray] = useState<SelectItem[]>([])
  const [lastNumber, setLastNumber] = useState(0)
  const [reload, setReload] = useState(false)
  const router = useRouter()
  const { createCombo, createComboLoading } = combos.useCreate()
  const { plansData } = plans.useList()
  const { productsData } = products.useProduct()
  const { servicesData } = services.useService()
  const { register, control, handleSubmit, watch, setValue } = useForm()

  async function onSubmit(data: any) {
    try {
      const filteredItensGroups = itensGroup.filter((item) => item !== 0)

      let plansValues = filteredItensGroups.map((item) => {
        if (data['tipo' + item].key === 'plans') {
          const plan = data['item' + item].key
          let value = plan.Precos[0].ValorPraticado
            ? plan.Precos[0].ValorBase + plan.Precos[0].ValorPraticado
            : plan.Precos[0].ValorBase + plan.Precos[0].ServicoPreco.Valor

          if (data['Desconto' + item]) {
            value = value - value * (data['Desconto' + item] / 100)
          }

          return {
            Plano_Id: plan.Id,
            PlanoPreco_Id: plan.Precos[0].Id,
            ValorPraticado: value
          }
        }
      })
      plansValues = plansValues.filter((item) => item !== undefined)

      let produtosData = filteredItensGroups.map((item) => {
        if (data['tipo' + item].key === 'products') {
          const product = data['item' + item].key
          let value = product.Fornecedores[0].Precos[0].Valor
          if (data['Desconto' + item]) {
            value = value - value * (data['Desconto' + item] / 100)
          }
          return {
            Produto_Id: product.Id,
            ProdutoPreco_Id: product.Fornecedores[0].Precos[0].Id,
            ValorPraticado: value
          }
        }
      })
      produtosData = produtosData.filter((item) => item !== undefined)

      let servicosData = filteredItensGroups.map((item) => {
        if (data['tipo' + item].key === 'services') {
          const service = data['item' + item].key
          let value = service.Fornecedores[0].Precos[0].Valor
          if (data['Desconto' + item]) {
            value = value - value * (data['Desconto' + item] / 100)
          }
          return {
            Servico_Id: service.Id,
            ServicoPreco_Id: service.Fornecedores[0].Precos[0].Id,
            ValorPraticado: value
          }
        }
      })
      servicosData = servicosData.filter((item) => item !== undefined)

      await createCombo({
        variables: {
          Nome: data.Nome,
          ValorBase: Number(BRLMoneyUnformat(data.Valor)).toFixed(2),
          planosData: plansValues,
          produtosData: produtosData,
          servicosData: servicosData
        }
      }).then(() => {
        router.push(rotas.erp.comercial.combos.index)
        notification(data.Nome + ' criado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  useEffect(() => {
    if (itensGroup[itensGroup.length - 1] > lastNumber) {
      setLastNumber(itensGroup[itensGroup.length - 1])
    }
  }, [itensGroup, lastNumber])

  useEffect(() => {
    if (plansData) {
      setPlansArray(
        plansData.map((plan) => {
          return { key: plan, title: plan.Nome }
        })
      )
    }

    if (productsData) {
      const filteredProductsData = productsData.filter(
        (product) => product.Fornecedores.length > 0
      )
      setProductsArray(
        filteredProductsData.map((product) => {
          return {
            key: product,
            title: product.Nome
          }
        })
      )
    }

    if (servicesData) {
      const filteredServicesData = servicesData.filter(
        (service) => service.Fornecedores.length > 0
      )
      setServicesArray(
        filteredServicesData.map((service) => {
          return {
            key: service,
            title: service.Nome
          }
        })
      )
    }
  }, [plansData, productsData, servicesData])

  function getSelectItens(value: string) {
    switch (value) {
      case 'plans':
        return plansArray
      case 'products':
        return productsArray
      case 'services':
        return servicesArray
    }
    return [] as SelectItem[]
  }

  function getServicesDependencies(value: any, position: number) {
    let array = []
    switch (watch('tipo' + position).key) {
      case 'plans':
        return `Serviços inclusos: ${value.Servico.Nome}`
      case 'products':
        array = value.Servicos_Produtos.map(
          (item: {
            Id: string
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        if (array.length === 0) return
        return `Serviços inclusos: ${array.map((item: string) => ' ' + item)}`
      case 'services':
        array = value.servicosServicos.map(
          (item: {
            Id: string
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        if (array.length === 0) return
        return `Serviços inclusos: ${array.map((item: string) => ' ' + item)}`
    }
    return
  }

  function getProductsDependencies(value: any, position: number) {
    let array = []
    switch (watch('tipo' + position).key) {
      case 'products':
        array = value.ProdutosQueDependo.map(
          (item: {
            Id: string
            ProdutoDependente: {
              Nome: string
            }
          }) => item.ProdutoDependente.Nome
        )
        if (array.length === 0) return
        return `Produtos inclusos: ${array.map((item: string) => ' ' + item)}`
      case 'services':
        array = value.Produtos_Servicos.map(
          (item: {
            Id: string
            Produto: {
              Nome: string
            }
          }) => item.Produto.Nome
        )
        if (array.length === 0) return
        return `Produtos inclusos: ${array.map((item: string) => ' ' + item)}`
    }
    return
  }

  function disableMainButton() {
    const array: null[] = []
    itensGroup.map((itemPosition) => {
      if (itemPosition !== 0) {
        if (watch('item' + itemPosition) === undefined) {
          array.push(null)
        }
      }
      if (
        watch('Nome') === undefined ||
        watch('Nome') === '' ||
        watch('Valor') === undefined ||
        watch('Valor') === ''
      ) {
        array.push(null)
      }
    })
    if (array.includes(null)) {
      return true
    }
    return createComboLoading
  }

  function getItemPrice(item: any, type: string, position: number) {
    let price = '0'
    switch (type) {
      case 'plans':
        price = item.Precos[0].ValorPraticado
          ? (BRLMoneyInputDefaultFormat(
              (
                item.Precos[0].ValorBase + item.Precos[0].ValorPraticado
              ).toFixed(2)
            ) as string)
          : (BRLMoneyInputDefaultFormat(
              (
                item.Precos[0].ValorBase + item.Precos[0].ServicoPreco.Valor
              ).toFixed(2)
            ) as string)
        break
      case 'products':
        price = BRLMoneyInputDefaultFormat(
          item.Fornecedores[0].Precos[0].Valor.toFixed(2)
        ) as string

        break
      case 'services':
        price = BRLMoneyInputDefaultFormat(
          item.Fornecedores[0].Precos[0].Valor.toFixed(2)
        ) as string

        break
    }

    setValue('Valor' + position, price)
  }

  function getPraticePriceValue(percentOff: number, position: number) {
    let finalValue = Number(BRLMoneyUnformat(watch('Valor' + position)))
    finalValue = finalValue - finalValue * (percentOff / 100)
    setValue(
      'ValorPraticado' + position,
      BRLMoneyInputDefaultFormat(finalValue.toFixed(2))
    )
  }

  function getTotalPrice() {
    let price = 0
    itensGroup.map((item) => {
      if (item !== 0 && watch('item' + item)) {
        let value = 0
        let plan: {
          ValorPraticado: number
          ValorBase: number
          ServicoPreco: { Valor: number }
        }
        watch('item' + item).key
        switch (watch('tipo' + item).key) {
          case 'plans':
            plan = watch('item' + item).key.Precos[0]
            value = plan.ValorPraticado
              ? plan.ValorBase + plan.ValorPraticado
              : plan.ValorBase + plan.ServicoPreco.Valor
            if (watch('Desconto' + item)) {
              value =
                value -
                value *
                  (Number(BRLMoneyUnformat(watch('Desconto' + item))) / 100)
            }
            price += value
            break
          case 'products':
            value = watch('item' + item).key.Fornecedores[0].Precos[0].Valor
            if (watch('Desconto' + item)) {
              value =
                value -
                value *
                  (Number(BRLMoneyUnformat(watch('Desconto' + item))) / 100)
            }
            price += value
            break
          case 'services':
            value = watch('item' + item).key.Fornecedores[0].Precos[0].Valor
            if (watch('Desconto' + item)) {
              value =
                value -
                value *
                  (Number(BRLMoneyUnformat(watch('Desconto' + item))) / 100)
            }
            price += value
            break
        }
      }
    })
    if (watch('Valor')) {
      price += Number(BRLMoneyUnformat(watch('Valor')))
    }

    return BRLMoneyFormat(Number(price.toFixed(2)))
  }

  return (
    <common.Card>
      <div className="flex justify-between">
        <common.GenericTitle
          title="Dados do combo"
          subtitle="Nome e itens"
          className="px-6"
        />
        <p className="px-6 mt-2 text-xl">Valor Total: {getTotalPrice()}</p>
      </div>

      <common.Separator />
      <form>
        <form.FormLine grid={2} position={1}>
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
        </form.FormLine>

        {itensGroup.map(
          (itemPosition, index) =>
            itemPosition !== 0 && (
              <form.FormLine position={index} grid={1} key={index}>
                <div className="grid grid-cols-6 gap-4">
                  <Controller
                    control={control}
                    name={'tipo' + itemPosition}
                    render={({ field: { onChange, value } }) => (
                      <div className="col-span-3">
                        <form.Select
                          itens={[
                            { key: 'plans', title: 'Plano' },
                            { key: 'products', title: 'Produto' },
                            { key: 'services', title: 'Serviço' }
                          ]}
                          value={value}
                          onChange={(e) => {
                            setValue('item' + itemPosition, undefined)
                            onChange(e)
                          }}
                          label="Tipo"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name={'item' + itemPosition}
                    render={({ field: { onChange, value } }) => (
                      <div className="col-span-3">
                        <form.Select
                          itens={
                            watch('tipo' + itemPosition)
                              ? getSelectItens(watch('tipo' + itemPosition).key)
                              : []
                          }
                          value={value}
                          onChange={(e) => {
                            getItemPrice(
                              e.key,
                              watch('tipo' + itemPosition).key,
                              itemPosition
                            )
                            onChange(e)
                          }}
                          label={
                            watch('tipo' + itemPosition)
                              ? watch('tipo' + itemPosition).title
                              : 'item'
                          }
                          disabled={watch('tipo' + itemPosition) === undefined}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name={'Valor' + itemPosition}
                    render={({ field: { value } }) => (
                      <div className="col-span-2">
                        <form.Input
                          fieldName={'Valor'}
                          title={`Valor`}
                          value={value}
                          disabled
                          icon="R$"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name={'Desconto' + itemPosition}
                    render={({ field: { onChange, value } }) => (
                      <div className="col-span-2">
                        <form.Input
                          fieldName={'Desconto' + itemPosition}
                          title="Desconto do item em %"
                          type="number"
                          onChange={(e) => {
                            if (
                              Number(e.target.value) >= 0 &&
                              Number(e.target.value) <= 100
                            ) {
                              getPraticePriceValue(
                                Number(e.target.value),
                                itemPosition
                              )
                              onChange(e)
                            }
                          }}
                          value={value}
                          disabled={watch('item' + itemPosition) === undefined}
                        />
                        <p>(opcional)</p>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name={'ValorPraticado' + itemPosition}
                    render={({ field: { value } }) => (
                      <div className="flex col-span-2 gap-2">
                        <div className="flex-1">
                          <form.Input
                            fieldName={'ValorPraticado' + itemPosition}
                            title="Valor praticado"
                            value={value}
                            disabled
                            icon="R$"
                          />
                        </div>
                        {itemPosition !== 1 && (
                          <buttons.DeleteButton
                            onClick={() => {
                              itensGroup[index] = 0
                              setReload(!reload)
                            }}
                          />
                        )}
                      </div>
                    )}
                  />
                </div>
                {watch('item' + itemPosition) ? (
                  <div>
                    <div>
                      <p>
                        {getServicesDependencies(
                          watch('item' + itemPosition).key,
                          itemPosition
                        )}
                      </p>
                    </div>

                    {watch('tipo' + itemPosition).key !== 'plans' && (
                      <p>
                        {getProductsDependencies(
                          watch('item' + itemPosition).key,
                          itemPosition
                        )}
                      </p>
                    )}
                  </div>
                ) : null}
              </form.FormLine>
            )
        )}

        {!createComboLoading && (
          <common.AddForm
            array={itensGroup}
            setArray={setItensGroup}
            lastNumber={lastNumber}
          >
            Adicionar outro item
          </common.AddForm>
        )}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Cadastrar"
          disabled={disableMainButton()}
          onClick={handleSubmit(onSubmit)}
          loading={createComboLoading}
        />
      </div>
    </common.Card>
  )
}

export default CreateCombo
