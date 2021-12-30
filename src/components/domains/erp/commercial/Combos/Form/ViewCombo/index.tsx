import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as services from '@/domains/erp/commercial/Services'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  BRLMoneyFormat,
  BRLMoneyInputDefaultFormat,
  BRLMoneyUnformat
} from 'utils/formaters'
import { notification } from 'utils/notification'

type SelectItem = {
  key: any
  title: string
}

const ViewCombo = () => {
  const [itensGroup, setItensGroup] = useState<number[]>([])
  const [plansArray, setPlansArray] = useState<SelectItem[]>([])
  const [productsArray, setProductsArray] = useState<SelectItem[]>([])
  const [servicesArray, setServicesArray] = useState<SelectItem[]>([])
  const [reload, setReload] = useState(false)
  // const [plansPositions, setPlansPositions] = useState<number[]>([])
  // const [productsPositions, setProductsPositions] = useState<number[]>([])
  // const [servicesPositions, setservicesPositions] = useState<number[]>([])
  const [lastNumber, setLastNumber] = useState(0)
  const { plansData } = plans.useList()
  const { productsData } = products.useProduct()
  const { servicesData } = services.useService()
  const {
    comboData,
    comboLoading,
    comboRefetch,
    softDeleteComboPlan,
    softDeleteComboPlanLoading,
    softDeleteComboProduct,
    softDeleteComboProductLoading,
    softDeleteComboService,
    softDeleteComboServiceLoading,
    createComboPlan,
    createComboPlanLoading,
    createComboProduct,
    createComboProductLoading,
    createComboService,
    createComboServiceLoading
  } = combos.useView()
  const { control, watch, setValue } = useForm()

  function showDependents(array: any[], phrase: string, layer: string) {
    array = array.map((item: any) => item[layer].Nome)
    if (array.length === 0) return
    return (
      <p>
        {phrase}:{' '}
        {array.map((item: string, index: number) => {
          if (index === 0) {
            return ' ' + item
          }
          return ', ' + item
        })}
      </p>
    )
  }

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

  async function createPlan(
    plan: {
      Id: string
      Precos: {
        Id: string
        ValorPraticado: number
        ValorBase: number
        ServicoPreco: { Valor: number }
      }[]
    },
    index: number,
    percentOff = undefined
  ) {
    let value = plan.Precos[0].ValorPraticado
      ? plan.Precos[0].ValorBase + plan.Precos[0].ValorPraticado
      : plan.Precos[0].ValorBase + plan.Precos[0].ServicoPreco.Valor

    if (percentOff) {
      value = value - value * (percentOff / 100)
    }
    await createComboPlan({
      variables: {
        Plano_Id: plan.Id,
        PlanoPreco_Id: plan.Precos[0].Id,
        ValorPraticado: value
      }
    }).then(() => {
      comboRefetch()
      itensGroup[index] = 0
      setReload(!reload)
      notification('Plano adicionado com sucesso', 'success')
    })
  }

  async function createProduct(
    product: {
      Id: string
      Fornecedores: { Precos: { Id: string; Valor: number }[] }[]
    },
    index: number,
    percentOff = undefined
  ) {
    let value = product.Fornecedores[0].Precos[0].Valor
    if (percentOff) {
      value = value - value * (percentOff / 100)
    }
    await createComboProduct({
      variables: {
        Produto_Id: product.Id,
        ProdutoPreco_Id: product.Fornecedores[0].Precos[0].Id,
        ValorPraticado: value
      }
    }).then(() => {
      comboRefetch()
      itensGroup[index] = 0
      setReload(!reload)
      notification('Produto adicionado com sucesso', 'success')
    })
  }

  async function createService(
    service: {
      Id: string
      Fornecedores: { Precos: { Id: string; Valor: number }[] }[]
    },
    index: number,
    percentOff = undefined
  ) {
    let value = service.Fornecedores[0].Precos[0].Valor
    if (percentOff) {
      value = value - value * (percentOff / 100)
    }
    await createComboService({
      variables: {
        Servico_Id: service.Id,
        ServicoPreco_Id: service.Fornecedores[0].Precos[0].Id,
        ValorPraticado: value
      }
    }).then(() => {
      comboRefetch()
      itensGroup[index] = 0
      setReload(!reload)
      notification('Serviço adicionado com sucesso', 'success')
    })
  }

  async function deletePlan(Id: string, index: number) {
    await softDeleteComboPlan({
      variables: { Id }
    }).then(() => {
      // const array = plansPositions.filter((_, position) => position !== index)
      // setPlansPositions(array)
      comboRefetch()
      // plansPositions.map((position, index) => {
      //   setValue('Valor' + position, comboData?.Planos[index].Plano)
      // })
      notification('Plano deletado com sucesso', 'success')
    })
  }

  async function deleteProduct(Id: string, index: number) {
    await softDeleteComboProduct({
      variables: { Id }
    }).then(() => {
      // const array = plansPositions.filter((_, position) => position !== index)
      // setPlansPositions(array)
      comboRefetch()
      // plansPositions.map((position, index) => {
      //   setValue('Valor' + position, comboData?.Planos[index].Plano)
      // })
      notification('Produto deletado com sucesso', 'success')
    })
  }

  async function deleteService(Id: string, index: number) {
    await softDeleteComboService({
      variables: { Id }
    }).then(() => {
      // const array = plansPositions.filter((_, position) => position !== index)
      // setPlansPositions(array)
      comboRefetch()
      // plansPositions.map((position, index) => {
      //   setValue('Valor' + position, comboData?.Planos[index].Plano)
      // })
      notification('Serviço deletado com sucesso', 'success')
    })
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

  function disableInsertButton() {
    return (
      createComboPlanLoading ||
      createComboProductLoading ||
      createComboServiceLoading
    )
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
    let totalPrice = 0

    comboData?.Planos.map((plan) => {
      totalPrice += Number(plan.ValorPraticado)
    })

    comboData?.Produtos.map((product) => {
      totalPrice += Number(product.ValorPraticado)
    })

    comboData?.Servicos.map((services) => {
      totalPrice += Number(services.ValorPraticado)
    })

    comboData?.Combos.map((combo) => {
      totalPrice += Number(combo.Valor)
    })

    totalPrice += Number(comboData?.Precos[0].ValorBase as string)

    return BRLMoneyFormat(totalPrice)
  }

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

  useEffect(() => {
    if (itensGroup[itensGroup.length - 1] > lastNumber) {
      setLastNumber(itensGroup[itensGroup.length - 1])
    }
  }, [itensGroup, lastNumber])

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
            <form.Input
              fieldName="Nome"
              title="Nome"
              value={comboData?.Nome}
              disabled
            />
          </div>

          <div>
            <form.Input
              fieldName={'Valor'}
              title={`Preço`}
              value={BRLMoneyInputDefaultFormat(
                Number(comboData?.Precos[0].ValorBase).toFixed(2)
              )}
              icon="R$"
              disabled
            />
          </div>
        </form.FormLine>

        {comboData?.Planos.map((plan, index) => {
          const planPrice = plan.PlanoPreco.ValorPraticado
            ? plan.PlanoPreco.ValorBase + plan.PlanoPreco.ValorPraticado
            : plan.PlanoPreco.ValorBase + plan.PlanoPreco.ServicoPreco.Valor

          return (
            <form.FormLine position={index} grid={1} key={index}>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-3">
                  <form.Select
                    itens={[]}
                    value={{ key: 'plans', title: 'Plano' }}
                    onChange={() => null}
                    label="Tipo"
                    disabled
                  />
                </div>

                <div className="col-span-3">
                  <form.Select
                    itens={[]}
                    value={{ key: plan.Id, title: plan.Plano.Nome }}
                    onChange={() => null}
                    label="Plano"
                    disabled
                  />
                </div>

                <div className="col-span-2">
                  <form.Input
                    fieldName={'Valor'}
                    title={`Valor`}
                    value={BRLMoneyInputDefaultFormat(
                      Number(planPrice).toFixed(2)
                    )}
                    icon="R$"
                    disabled
                  />
                </div>

                <div className="col-span-2">
                  <form.Input
                    fieldName={'Desconto'}
                    title="Desconto do plano em %"
                    type="number"
                    value={(
                      100 -
                      (Number(plan.ValorPraticado) * 100) / Number(planPrice)
                    ).toFixed(2)}
                    disabled
                  />
                </div>

                <div className="flex col-span-2 gap-2">
                  <div className="flex-1">
                    <form.Input
                      fieldName={'ValorPraticado'}
                      title="Valor praticado"
                      value={BRLMoneyInputDefaultFormat(
                        Number(plan.ValorPraticado).toFixed(2)
                      )}
                      icon="R$"
                      disabled
                    />
                  </div>
                  <div>
                    <buttons.DeleteButton
                      onClick={() => deletePlan(plan.Id, index)}
                      disabled={softDeleteComboPlanLoading || comboLoading}
                      loading={softDeleteComboPlanLoading || comboLoading}
                    />
                  </div>
                </div>
              </div>
              <div>
                <p>Serviços inclusos: {plan.Plano.Servico.Nome}</p>
              </div>
            </form.FormLine>
          )
        })}

        {comboData?.Produtos.map((product, index) => (
          <form.FormLine
            position={comboData?.Planos.length + index}
            grid={1}
            key={index}
          >
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <form.Select
                  itens={[]}
                  value={{ key: 'product', title: 'Produto' }}
                  onChange={() => null}
                  label="Tipo"
                  disabled
                />
              </div>

              <div className="col-span-3">
                <form.Select
                  itens={[]}
                  value={{ key: product.Id, title: product.Produto.Nome }}
                  onChange={() => null}
                  label="Produto"
                  disabled
                />
              </div>

              <div className="col-span-2">
                <form.Input
                  fieldName={'Valor'}
                  title={`Valor`}
                  value={BRLMoneyInputDefaultFormat(
                    product.ProdutoPreco.Valor || '0'
                  )}
                  icon="R$"
                  disabled
                />
              </div>
              <div className="col-span-2">
                <form.Input
                  fieldName={'Desconto'}
                  title="Desconto do produto em %"
                  type="number"
                  value={(
                    100 -
                    (Number(product.ValorPraticado) * 100) /
                      Number(product.ProdutoPreco.Valor)
                  ).toFixed(2)}
                  disabled
                />
              </div>

              <div className="flex col-span-2 gap-2">
                <div className="flex-1">
                  <form.Input
                    fieldName={'ValorPraticado'}
                    title="Valor praticado"
                    value={BRLMoneyInputDefaultFormat(
                      Number(product.ValorPraticado).toFixed(2)
                    )}
                    icon="R$"
                    disabled
                  />
                </div>
                <div>
                  <buttons.DeleteButton
                    onClick={() => deleteProduct(product.Id, index)}
                    disabled={softDeleteComboProductLoading || comboLoading}
                    loading={softDeleteComboProductLoading || comboLoading}
                  />
                </div>
              </div>
            </div>
            <div>
              {showDependents(
                product.Produto.Servicos_Produtos,
                'Serviços inclusos',
                'Servico'
              )}
              {showDependents(
                product.Produto.ProdutosQueDependo,
                'Produtos inclusos',
                'ProdutoDependente'
              )}
            </div>
          </form.FormLine>
        ))}

        {comboData?.Servicos.map((service, index) => (
          <form.FormLine
            position={
              comboData?.Planos.length + comboData?.Produtos.length + index
            }
            grid={1}
            key={index}
          >
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <form.Select
                  itens={[]}
                  value={{ key: 'service', title: 'Serviço' }}
                  onChange={() => null}
                  label="Tipo"
                  disabled
                />
              </div>

              <div className="col-span-3">
                <form.Select
                  itens={[]}
                  value={{ key: service.Id, title: service.Servico.Nome }}
                  onChange={() => null}
                  label="Serviço"
                  disabled
                />
              </div>
              <div className="col-span-2">
                <form.Input
                  fieldName={'Valor'}
                  title={`Valor`}
                  value={BRLMoneyInputDefaultFormat(
                    service.ServicosPreco.Valor || '0'
                  )}
                  icon="R$"
                  disabled
                />
              </div>
              <div className="col-span-2">
                <form.Input
                  fieldName={'Desconto'}
                  title="Desconto do serviço em %"
                  type="number"
                  value={(
                    100 -
                    (Number(service.ValorPraticado) * 100) /
                      Number(service.ServicosPreco.Valor)
                  ).toFixed(2)}
                  disabled
                />
              </div>

              <div className="flex col-span-2 gap-2">
                <div className="flex-1">
                  <form.Input
                    fieldName={'ValorPraticado'}
                    title="Valor praticado"
                    value={BRLMoneyInputDefaultFormat(
                      Number(service.ValorPraticado).toFixed(2)
                    )}
                    icon="R$"
                    disabled
                  />
                </div>
                <div>
                  <buttons.DeleteButton
                    onClick={() => deleteService(service.Id, index)}
                    disabled={softDeleteComboServiceLoading || comboLoading}
                    loading={softDeleteComboServiceLoading || comboLoading}
                  />
                </div>
              </div>
            </div>
            <div>
              {showDependents(
                service.Servico.servicosServicos,
                'Serviços inclusos',
                'Servico'
              )}
              {showDependents(
                service.Servico.Produtos_Servicos,
                'Produtos inclusos',
                'Produto'
              )}
            </div>
          </form.FormLine>
        ))}

        {itensGroup.map(
          (itemPosition, index) =>
            itemPosition !== 0 && (
              <form.FormLine
                position={
                  comboData!.Planos.length +
                  comboData!.Produtos.length +
                  comboData!.Servicos.length +
                  index
                }
                grid={1}
                key={index}
              >
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
                        <form.Input
                          fieldName={'ValorPraticado' + itemPosition}
                          title="Valor praticado"
                          value={value}
                          disabled
                          icon="R$"
                        />
                      </div>
                    )}
                  />
                  <div className="flex items-center justify-end col-span-6 gap-4">
                    <buttons.DeleteButton
                      onClick={() => {
                        itensGroup[index] = 0
                        setReload(!reload)
                      }}
                      disabled={disableInsertButton()}
                      loading={disableInsertButton()}
                      className="mb-0"
                    />
                    <buttons.SecondaryButton
                      handler={() => {
                        if (
                          watch('item' + itemPosition) === undefined ||
                          watch('tipo' + itemPosition) === undefined
                        ) {
                          return notification(
                            'Preencha todos os campos para inserir',
                            'error'
                          )
                        }
                        switch (watch('tipo' + itemPosition).key) {
                          case 'plans':
                            createPlan(
                              watch('item' + itemPosition).key,
                              index,
                              watch('Desconto' + itemPosition)
                            )
                            break
                          case 'products':
                            createProduct(
                              watch('item' + itemPosition).key,
                              index,
                              watch('Desconto' + itemPosition)
                            )
                            break
                          case 'services':
                            createService(
                              watch('item' + itemPosition).key,
                              index,
                              watch('Desconto' + itemPosition)
                            )
                            break
                        }
                      }}
                      disabled={disableInsertButton()}
                      loading={disableInsertButton()}
                      type="button"
                      className="w-10 h-6"
                    />
                  </div>
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

        {comboData ? (
          <common.AddForm
            array={itensGroup}
            setArray={setItensGroup}
            lastNumber={lastNumber}
          >
            Adicionar outro item
          </common.AddForm>
        ) : null}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
      </div>
    </common.Card>
  )
}

export default ViewCombo
