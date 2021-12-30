import { useForm, Controller } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as proposals from '@/domains/erp/commercial/Proposals'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as services from '@/domains/erp/commercial/Services'
import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { BRLMoneyFormat, BRLMoneyInputDefaultFormat } from 'utils/formaters'
import { showError } from 'utils/showError'
import { notification } from 'utils/notification'

type SelectItem = {
  key: any
  title: string
}

type CreateVehicleProps = {
  proposal?: proposals.ProposalsArray
  onChange: (value: any) => void
  parentSubmit?: (
    e?: BaseSyntheticEvent<Record<string, unknown>, any, any> | undefined
  ) => Promise<void>
  vehicleName: string
  vehicleId?: string | null
  hideHeader?: boolean
  hideBackButton?: boolean
  vehicleNumber?: number
  inLineSubmit?: boolean
  createLoading?: boolean
  refetch?: () => void
  proposalRefetch?: () => void
}

const CreateProposal = ({
  proposal,
  onChange,
  parentSubmit,
  vehicleName,
  vehicleId,
  hideBackButton = false,
  hideHeader = false,
  createLoading = false,
  vehicleNumber = 1,
  inLineSubmit = false,
  refetch = () => null,
  proposalRefetch = () => null
}: CreateVehicleProps) => {
  const [itensGroup, setItensGroup] = useState<number[]>(
    inLineSubmit ? [] : [1]
  )
  const [plansArray, setPlansArray] = useState<SelectItem[]>([])
  const [productsArray, setProductsArray] = useState<SelectItem[]>([])
  const [servicesArray, setServicesArray] = useState<SelectItem[]>([])
  const [combosArray, setCombosArray] = useState<SelectItem[]>([])
  const [UpSellings, setUpSellings] = useState<
    {
      OportunidadeProduto_Id: string | null
      OportunidadeServico_Id: string | null
      Veiculo: number
    }[]
  >([])
  const [lastNumber, setLastNumber] = useState(0)
  const [comboPosition, setComboPositions] = useState(1)
  const [itemGroupIndex, setItemGroupIndex] = useState(0)
  const [reload, setReload] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [plansToDelete, setPlansToDelete] = useState<
    {
      Id: string
      Plano: {
        Nome: string
      }
    }[]
  >([])
  const [productsToDelete, setProductsToDelete] = useState<
    {
      Id: string
      Produto: {
        Nome: string
      }
    }[]
  >([])
  const [servicesToDelete, setServicesToDelete] = useState<
    {
      Id: string
      Servico: {
        Nome: string
      }
    }[]
  >([])
  const {
    createProposalComboLoading,
    createProposalServiceLoading,
    createProposalPlanLoading,
    createProposalProductLoading,
    createProposalUpSellingLoading,
    createProposalCombo,
    createProposalService,
    createProposalPlan,
    createProposalProduct,
    createProposalUpSelling,
    deleteProposalPlan,
    deleteProposalProduct,
    deleteProposalService,
    deleteProposalServiceLoading,
    deleteProposalPlanLoading,
    deleteProposalProductLoading
  } = proposals.useView()
  const { createProposalLoading } = proposals.useCreate()
  const { combosData } = combos.useList()
  const { plansData } = plans.useList()
  const { productsData } = products.useProduct()
  const { servicesData } = services.useService()

  const { control, handleSubmit, watch, setValue } = useForm()

  async function onSubmit(data: any) {
    const filteredItensGroups = itensGroup.filter((vehicle) => vehicle !== 0)

    const validation = filteredItensGroups.map((item) => {
      if (!data['tipo' + item] || !data['item' + item]) {
        return null
      }
    })
    try {
      if (validation.includes(null)) {
        throw new Error('Selecione todos os campos para continuar')
      }
    } catch (error: any) {
      showError(error)
      return
    }

    const proposalPlansNameArray: string[] = []
    const proposalProductsNameArray: string[] = []
    const proposalServicesNameArray: string[] = []

    filteredItensGroups.map((item) => {
      if (watch('tipo' + item).key === 'combos') {
        proposalPlansNameArray.push(
          ...watch('item' + item).key.Planos.map(
            (plan: { Plano: { Nome: string } }) => plan.Plano.Nome
          )
        )

        proposalProductsNameArray.push(
          ...watch('item' + item).key.Produtos.map(
            (product: { Produto: { Nome: string } }) => product.Produto.Nome
          )
        )

        proposalServicesNameArray.push(
          ...watch('item' + item).key.Servicos.map(
            (services: { Servico: { Nome: string } }) => services.Servico.Nome
          )
        )

        watch('item' + item).key.Combos.map(
          (combo: {
            Combo: {
              Planos: { Plano: { Nome: string } }[]
              Produtos: { Produto: { Nome: string } }[]
              Servicos: { Servico: { Nome: string } }[]
            }
          }) => {
            proposalPlansNameArray.push(
              ...combo.Combo.Planos.map((plan) => plan.Plano.Nome)
            )
            proposalProductsNameArray.push(
              ...combo.Combo.Produtos.map((product) => product.Produto.Nome)
            )
            proposalServicesNameArray.push(
              ...combo.Combo.Servicos.map((service) => service.Servico.Nome)
            )
          }
        )
      }
    })

    if (
      new Set(proposalPlansNameArray).size !== proposalPlansNameArray.length
    ) {
      return notification(
        'Remova os planos duplicados ou que já estão inclusos no combo',
        'error'
      )
    }

    if (
      new Set(proposalProductsNameArray).size !==
      proposalProductsNameArray.length
    ) {
      return notification(
        'Remova os produtos duplicados ou que já estão inclusos no combo',
        'error'
      )
    }

    if (
      new Set(proposalServicesNameArray).size !==
      proposalServicesNameArray.length
    ) {
      return notification(
        'Remova os serviços duplicados que já estão inclusos no combo',
        'error'
      )
    }

    // const duplicateValidation = filteredItensGroups.map((item) => {
    //   if (watch('tipo' + item).key === 'plans') {
    //     if (proposalPlansNameArray.includes(watch('item' + item).title)) {
    //       return notification(
    //         'Remova os planos que já estão inclusos no combo',
    //         'error'
    //       )
    //     }
    //   }

    //   if (watch('tipo' + item).key === 'products') {
    //     if (proposalProductsNameArray.includes(watch('item' + item).title)) {
    //       return notification(
    //         'Remova os produtos que já estão inclusos no combo',
    //         'error'
    //       )
    //     }
    //   }

    //   if (watch('tipo' + item).key === 'services') {
    //     if (comboServicesNamesArray.includes(watch('item' + item).title)) {
    //       return notification(
    //         'Remova os serviços que já estão inclusos no combo',
    //         'error'
    //       )
    //     }
    //   }

    //   return true
    // })

    // if (duplicateValidation.includes(undefined)) {
    //   return
    // }

    let planosData = filteredItensGroups.map((item) => {
      if (data['tipo' + item].key === 'plans') {
        return {
          Plano_Id: data['item' + item].key.Id,
          PlanoPreco_Id: data['item' + item].key.Precos[0].Id,
          Veiculo: vehicleNumber
        }
      }
    })
    planosData = planosData.filter((item) => item !== undefined)

    let produtosData = filteredItensGroups.map((item) => {
      if (data['tipo' + item].key === 'products') {
        return {
          Produto_Id: data['item' + item].key.Id,
          ProdutoPreco_Id: data['item' + item].key.Fornecedores[0].Precos[0].Id,
          Veiculo: vehicleNumber
        }
      }
    })
    produtosData = produtosData.filter((item) => item !== undefined)

    let servicosData = filteredItensGroups.map((item) => {
      if (data['tipo' + item].key === 'services') {
        return {
          Servico_Id: data['item' + item].key.Id,
          ServicosPreco_Id:
            data['item' + item].key.Fornecedores[0].Precos[0].Id,
          Veiculo: vehicleNumber
        }
      }
    })
    servicosData = servicosData.filter((item) => item !== undefined)

    let combosData = filteredItensGroups.map((item) => {
      if (data['tipo' + item].key === 'combos') {
        return {
          Combo_Id: data['item' + item].key.Id,
          ComboPreco_Id: data['item' + item].key.Precos[0].Id,
          Veiculo: vehicleNumber
        }
      }
    })
    combosData = combosData.filter((item) => item !== undefined)

    onChange({
      planos: planosData,
      produtos: produtosData,
      servicos: servicosData,
      combos: combosData,
      oportunidades: UpSellings
    })
    parentSubmit && parentSubmit()
  }

  async function modalSubmit() {
    try {
      plansToDelete.map(async (plan) => {
        await deleteProposalPlan({
          variables: {
            Id: plan.Id
          }
        })
      })

      productsToDelete.map(async (product) => {
        await deleteProposalProduct({
          variables: {
            Id: product.Id
          }
        })
      })

      servicesToDelete.map(async (service) => {
        await deleteProposalService({
          variables: {
            Id: service.Id
          }
        })
      })

      const comboValue = watch('item' + comboPosition)?.key
      const productsUpSelling = comboValue?.OportunidadesDeProdutos?.map(
        (item: { Id: string }) => item.Id
      )

      const servicesUpSelling = comboValue?.OportunidadesDeServicos?.map(
        (item: { Id: string }) => item.Id
      )

      UpSellings.map(async (upselling) => {
        if (
          servicesUpSelling.includes(
            upselling.OportunidadeServico_Id as string
          ) ||
          productsUpSelling.includes(upselling.OportunidadeProduto_Id as string)
        ) {
          await createProposalUpSelling({
            variables: {
              OportunidadeProduto_Id: upselling.OportunidadeProduto_Id,
              OportunidadeServico_Id: upselling.OportunidadeServico_Id,
              Veiculo: vehicleNumber
            }
          })
        }
      })
      await createProposalCombo({
        variables: {
          Combo_Id: watch('item' + comboPosition).key.Id,
          ComboPreco_Id: watch('item' + comboPosition).key.Precos[0].Id,
          Veiculo_Id: vehicleId,
          Veiculo: vehicleNumber
        }
      })

      setOpenModal(false)
      setProductsToDelete([])
      setPlansToDelete([])
      setProductsToDelete([])
      setServicesToDelete([])
      setReload(!reload)
      refetch()
      itensGroup[itemGroupIndex] = 0
    } catch (err: any) {
      showError(err)
    }
  }

  function getSelectItens(value: string) {
    switch (value) {
      case 'plans':
        return plansArray
      case 'products':
        return productsArray
      case 'services':
        return servicesArray
      case 'combos':
        return combosArray
    }
    return [] as SelectItem[]
  }

  function getServicesDependencies(value: any, position: number) {
    let array: string[] = []
    switch (watch('tipo' + position).key) {
      case 'plans':
        return `Serviços inclusos: ${value.Servico.Nome}`

      case 'products':
        array = value.Servicos_Produtos.map(
          (item: {
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
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        if (array.length === 0) return
        return `Serviços inclusos: ${array.map((item: string) => ' ' + item)}`

      case 'combos':
        array = value.Servicos.map(
          (item: {
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        value.Combos.map(
          (combo: {
            Combo: {
              Servicos: {
                Servico: {
                  Nome: string
                }
              }[]
            }
          }) => {
            combo.Combo.Servicos.map(
              (insideCombo: {
                Servico: {
                  Nome: string
                }
              }) => {
                if (!array.includes(insideCombo.Servico.Nome)) {
                  array.push(insideCombo.Servico.Nome)
                }
              }
            )
          }
        )
        if (array.length === 0) return
        return `Serviços inclusos: ${array.map((item: string) => ' ' + item)}`
    }
    return
  }

  function getProductsDependencies(value: any, position: number) {
    let array: string[] = []
    switch (watch('tipo' + position).key) {
      case 'products':
        array = value.ProdutosQueDependo.map(
          (item: {
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
            Produto: {
              Nome: string
            }
          }) => item.Produto.Nome
        )
        if (array.length === 0) return
        return `Produtos inclusos: ${array.map((item: string) => ' ' + item)}`

      case 'combos':
        array = value.Produtos.map(
          (item: {
            Produto: {
              Nome: string
            }
          }) => item.Produto.Nome
        )
        value.Combos.map(
          (combo: {
            Combo: {
              Produtos: {
                Produto: {
                  Nome: string
                }
              }[]
            }
          }) => {
            combo.Combo.Produtos.map(
              (insideCombo: {
                Produto: {
                  Nome: string
                }
              }) => {
                if (!array.includes(insideCombo.Produto.Nome)) {
                  array.push(insideCombo.Produto.Nome)
                }
              }
            )
          }
        )
        if (array.length === 0) return
        return `Produtos inclusos: ${array.map((item: string) => ' ' + item)}`
    }
    return
  }

  function getPlansDependencies(value: any) {
    let array: string[] = []

    array = value?.Planos.map(
      (item: {
        Plano: {
          Nome: string
        }
      }) => item.Plano.Nome
    )

    value.Combos.map(
      (combo: {
        Combo: {
          Planos: {
            Plano: {
              Nome: string
            }
          }[]
        }
      }) => {
        combo.Combo.Planos.map(
          (insideCombo: {
            Plano: {
              Nome: string
            }
          }) => {
            if (!array.includes(insideCombo.Plano.Nome)) {
              array.push(insideCombo.Plano.Nome)
            }
          }
        )
      }
    )

    if (array.length === 0) return
    return `Planos inclusos: ${array.map((item: string) => ' ' + item)}`
  }

  function disableInlineButton() {
    return (
      createProposalComboLoading ||
      createProposalServiceLoading ||
      createProposalPlanLoading ||
      createProposalProductLoading ||
      createProposalUpSellingLoading
    )
  }

  function showAddFormButton() {
    if (inLineSubmit) {
      return (
        itensGroup.filter((item) => item === 0).length === itensGroup.length
      )
    }
    return !createProposalLoading
  }

  function getItemPrice(item: any, type: string) {
    let price = 0
    switch (type) {
      case 'plans':
        price = item.Precos[0].ValorPraticado
          ? item.Precos[0].ValorBase + item.Precos[0].ValorPraticado
          : item.Precos[0].ValorBase + item.Precos[0].ServicoPreco.Valor
        break
      case 'products':
        price = item.Fornecedores[0].Precos[0].Valor
        break
      case 'services':
        price = item.Fornecedores[0].Precos[0].Valor
        break
      case 'combos':
        item.Planos.map((plan: { ValorPraticado: number }) => {
          price += plan.ValorPraticado
        })
        item.Produtos.map((product: { ValorPraticado: number }) => {
          price += product.ValorPraticado
        })
        item.Servicos.map((service: { ValorPraticado: number }) => {
          price += service.ValorPraticado
        })
        item.Combos.map((combo: { Valor: number }) => {
          price += combo.Valor
        })
        price += item.Precos[0].ValorBase
        break
    }
    return BRLMoneyInputDefaultFormat(price.toFixed(2))
  }

  function getTotalValue() {
    let totalPrice = 0
    const filteredItensGroups = itensGroup.filter((vehicle) => vehicle !== 0)
    filteredItensGroups.map((item) => {
      if (watch('item' + item)) {
        if (watch('tipo' + item).key === 'plans') {
          const plan = watch('item' + item).key
          totalPrice += Number(
            plan.Precos[0].ValorPraticado
              ? plan.Precos[0].ValorPraticado + plan.Precos[0].ValorBase
              : plan.Precos[0].ValorBase + plan.Precos[0].ServicoPreco.Valor
          )
        }
        if (watch('tipo' + item).key === 'products') {
          totalPrice += Number(
            watch('item' + item).key.Fornecedores[0].Precos[0].Valor
          )
        }
        if (watch('tipo' + item).key === 'services') {
          totalPrice += Number(
            watch('item' + item).key.Fornecedores[0].Precos[0].Valor
          )
        }
        if (watch('tipo' + item).key === 'combos') {
          const combo = watch('item' + item).key
          combo.Planos.map((plan: { ValorPraticado: number }) => {
            totalPrice += plan.ValorPraticado
          })
          combo.Produtos.map((product: { ValorPraticado: number }) => {
            totalPrice += product.ValorPraticado
          })
          combo.Servicos.map((service: { ValorPraticado: number }) => {
            totalPrice += service.ValorPraticado
          })
          combo.Combos.map((combo: { Valor: number }) => {
            totalPrice += combo.Valor
          })
          totalPrice += Number(combo.Precos[0].ValorBase)
        }
      }
    })
    return BRLMoneyFormat(totalPrice)
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
      const filteredProducts = productsData.filter(
        (product) =>
          product.Tipo.Valor !== 'assistencia' &&
          product.Fornecedores.length > 0
      )

      setProductsArray(
        filteredProducts.map((product) => {
          return {
            key: product,
            title: product.Nome
          }
        })
      )
    }

    if (servicesData) {
      const filteredServices = servicesData.filter(
        (service) =>
          service.Tipo.Valor !== 'assistencia' &&
          service.Fornecedores.length > 0
      )
      setServicesArray(
        filteredServices.map((service) => {
          return {
            key: service,
            title: service.Nome
          }
        })
      )
    }

    if (combosData) {
      setCombosArray(
        combosData.map((combo) => {
          return {
            key: combo,
            title: combo.Nome
          }
        })
      )
    }
  }, [plansData, productsData, servicesData, combosData])

  return (
    <common.Card>
      {!hideHeader && (
        <div className="flex">
          <common.GenericTitle
            title={`Proposta do veículo: ${vehicleName}`}
            subtitle="Selecione combos, planos, serviços e produtos"
            className="flex-1 px-6"
          />
          <p className="mx-4 text-xl">Valor Total: {getTotalValue()}</p>
        </div>
      )}
      <common.Separator />
      {itensGroup.map(
        (itemPosition, index) =>
          itemPosition !== 0 && (
            <form.FormLine position={index} grid={1} key={index}>
              <div
                className={`grid ${
                  inLineSubmit ? 'grid-cols-10' : 'grid-cols-9'
                } gap-4`}
              >
                <Controller
                  control={control}
                  name={'tipo' + itemPosition}
                  render={({ field: { onChange, value } }) => (
                    <div className={'col-span-3'}>
                      <form.Select
                        itens={[
                          { key: 'plans', title: 'Plano' },
                          { key: 'products', title: 'Produto' },
                          { key: 'services', title: 'Serviço' },
                          { key: 'combos', title: 'Combos' }
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
                    <div className={'col-span-3'}>
                      <form.Select
                        itens={
                          watch('tipo' + itemPosition)
                            ? getSelectItens(watch('tipo' + itemPosition).key)
                            : []
                        }
                        value={value}
                        onChange={(e) => {
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

                <div className="col-span-2">
                  <form.Input
                    fieldName={'Valor'}
                    title={`Valor`}
                    value={
                      watch('item' + itemPosition)
                        ? getItemPrice(
                            watch('item' + itemPosition).key,
                            watch('tipo' + itemPosition).key
                          )
                        : undefined
                    }
                    icon="R$"
                    disabled
                  />
                </div>

                {inLineSubmit && (
                  <buttons.SecondaryButton
                    handler={async () => {
                      try {
                        let planValidation: (undefined | null)[]
                        const proposalPlansNameArray: string[] = []
                        const newPlansNameArray: string[] = []
                        const proposalComboPlansNameArray: string[] = []

                        let productValidation: (undefined | null)[]
                        const proposalProductsNameArray: string[] = []
                        const newProductsNameArray: string[] = []
                        const proposalComboProductNameArray: string[] = []

                        let serviceValidation: (undefined | null)[]
                        const proposalServicesNameArray: string[] = []
                        const newServicesNameArray: string[] = []
                        const proposalComboServiceNameArray: string[] = []

                        if (proposal) {
                          proposal.Planos.map((plan) => {
                            proposalPlansNameArray.push(plan.Plano.Nome)
                          })

                          proposal.Produtos.map((product) => {
                            proposalProductsNameArray.push(product.Produto.Nome)
                          })

                          proposal.Servicos.map((service) => {
                            proposalServicesNameArray.push(service.Servico.Nome)
                          })
                          proposal?.Combos.map((combo) => {
                            combo.Combo.Combos.map((insideCombo) => {
                              const plansArray = insideCombo.Combo.Planos.map(
                                (plan: { Plano: { Nome: string } }) =>
                                  plan.Plano.Nome
                              )

                              proposalComboPlansNameArray.push(...plansArray)
                              proposalPlansNameArray.push(...plansArray)

                              const productArray =
                                insideCombo.Combo.Produtos.map(
                                  (product: { Produto: { Nome: string } }) =>
                                    product.Produto.Nome
                                )

                              proposalProductsNameArray.push(...productArray)
                              proposalComboProductNameArray.push(
                                ...productArray
                              )

                              const serviceArray =
                                insideCombo.Combo.Servicos.map(
                                  (service: { Servico: { Nome: string } }) =>
                                    service.Servico.Nome
                                )

                              proposalServicesNameArray.push(...serviceArray)
                              proposalComboServiceNameArray.push(
                                ...serviceArray
                              )
                            })

                            const plansArray = combo.Combo.Planos.map(
                              (plan: { Plano: { Nome: string } }) =>
                                plan.Plano.Nome
                            )

                            proposalComboPlansNameArray.push(...plansArray)
                            proposalPlansNameArray.push(...plansArray)

                            const productArray = combo.Combo.Produtos.map(
                              (product: { Produto: { Nome: string } }) =>
                                product.Produto.Nome
                            )

                            proposalProductsNameArray.push(...productArray)
                            proposalComboProductNameArray.push(...productArray)

                            const serviceArray = combo.Combo.Servicos.map(
                              (service: { Servico: { Nome: string } }) =>
                                service.Servico.Nome
                            )

                            proposalServicesNameArray.push(...serviceArray)
                            proposalComboServiceNameArray.push(...serviceArray)
                          })

                          if (watch('tipo' + itemPosition).key === 'combos') {
                            newPlansNameArray.push(
                              ...watch('item' + itemPosition).key.Planos.map(
                                (plan: { Plano: { Nome: string } }) =>
                                  plan.Plano.Nome
                              )
                            )
                            newProductsNameArray.push(
                              ...watch('item' + itemPosition).key.Produtos.map(
                                (product: { Produto: { Nome: string } }) =>
                                  product.Produto.Nome
                              )
                            )
                            newServicesNameArray.push(
                              ...watch('item' + itemPosition).key.Servicos.map(
                                (service: { Servico: { Nome: string } }) =>
                                  service.Servico.Nome
                              )
                            )

                            watch('item' + itemPosition).key.Combos.map(
                              (combo: {
                                Combo: {
                                  Planos: { Plano: { Nome: string } }[]
                                  Produtos: { Produto: { Nome: string } }[]
                                  Servicos: { Servico: { Nome: string } }[]
                                }
                              }) => {
                                newPlansNameArray.push(
                                  ...combo.Combo.Planos.map(
                                    (plan) => plan.Plano.Nome
                                  )
                                )
                                newProductsNameArray.push(
                                  ...combo.Combo.Produtos.map(
                                    (product) => product.Produto.Nome
                                  )
                                )
                                newServicesNameArray.push(
                                  ...combo.Combo.Servicos.map(
                                    (service) => service.Servico.Nome
                                  )
                                )
                              }
                            )
                          }

                          if (watch('tipo' + itemPosition).key !== 'combos') {
                            switch (watch('tipo' + itemPosition).key) {
                              case 'plans':
                                newPlansNameArray.push(
                                  watch('item' + itemPosition).key.Nome
                                )
                                planValidation = newPlansNameArray.map(
                                  (plan) => {
                                    if (proposalPlansNameArray.includes(plan)) {
                                      return null
                                    }
                                  }
                                )
                                if (planValidation.includes(null)) {
                                  return notification(
                                    'Este plano já esta nesta proposta',
                                    'error'
                                  )
                                }
                                break
                              case 'products':
                                newProductsNameArray.push(
                                  watch('item' + itemPosition).key.Nome
                                )
                                productValidation = newProductsNameArray.map(
                                  (product) => {
                                    if (
                                      proposalProductsNameArray.includes(
                                        product
                                      )
                                    ) {
                                      return null
                                    }
                                  }
                                )
                                if (productValidation.includes(null)) {
                                  return notification(
                                    'Este produto já esta nesta proposta',
                                    'error'
                                  )
                                }
                                break
                              case 'services':
                                newServicesNameArray.push(
                                  watch('item' + itemPosition).key.Nome
                                )
                                serviceValidation = newServicesNameArray.map(
                                  (service) => {
                                    if (
                                      proposalServicesNameArray.includes(
                                        service
                                      )
                                    ) {
                                      return null
                                    }
                                  }
                                )
                                if (serviceValidation.includes(null)) {
                                  return notification(
                                    'Este serviço já esta nesta proposta',
                                    'error'
                                  )
                                }
                                break
                            }
                          }

                          const duplacateComboPlansValidation =
                            newPlansNameArray.map((plan) => {
                              if (proposalComboPlansNameArray.includes(plan)) {
                                return null
                              }
                            })

                          const duplicatePlanValidation = newPlansNameArray.map(
                            (plan) => {
                              if (proposalPlansNameArray.includes(plan)) {
                                const validation = proposal.Combos.map(
                                  (combo) => {
                                    const planNames = combo.Combo.Planos.map(
                                      (plan) => plan.Plano.Nome
                                    )
                                    if (planNames.includes(plan)) {
                                      return null
                                    }
                                  }
                                )
                                if (validation.includes(null)) {
                                  return null
                                }
                                const planToDelete = proposal.Planos.filter(
                                  (insidePlan) => insidePlan.Plano.Nome === plan
                                )
                                setPlansToDelete([
                                  ...plansToDelete,
                                  ...planToDelete
                                ])
                                return
                              }
                              return true
                            }
                          )

                          if (
                            duplicatePlanValidation.includes(null) ||
                            duplacateComboPlansValidation.includes(null)
                          ) {
                            return notification(
                              'Este combo tem planos presentes em outros combos!',
                              'error'
                            )
                          }

                          const duplicateProductValidation =
                            newProductsNameArray.map((product) => {
                              if (proposalProductsNameArray.includes(product)) {
                                const validation = proposal.Combos.map(
                                  (combo) => {
                                    const productNames =
                                      combo.Combo.Produtos.map(
                                        (product) => product.Produto.Nome
                                      )
                                    if (productNames.includes(product)) {
                                      return null
                                    }
                                  }
                                )
                                if (validation.includes(null)) {
                                  return null
                                }
                                const productToDelete =
                                  proposal.Produtos.filter(
                                    (insideProduct) =>
                                      insideProduct.Produto.Nome === product
                                  )
                                setProductsToDelete([
                                  ...productsToDelete,
                                  ...productToDelete
                                ])

                                return
                              }
                              return true
                            })

                          if (duplicateProductValidation.includes(null)) {
                            return notification(
                              'Este combo tem produtos presentes em outros combos!',
                              'error'
                            )
                          }

                          const duplicateServiceValidation =
                            newServicesNameArray.map((service) => {
                              if (proposalServicesNameArray.includes(service)) {
                                const validation = proposal.Combos.map(
                                  (combo) => {
                                    const serviceNames =
                                      combo.Combo.Servicos.map(
                                        (service) => service.Servico.Nome
                                      )
                                    if (serviceNames.includes(service)) {
                                      return null
                                    }
                                  }
                                )
                                if (validation.includes(null)) {
                                  return null
                                }
                                const serviceToDelete =
                                  proposal.Servicos.filter(
                                    (insideService) =>
                                      insideService.Servico.Nome === service
                                  )
                                setServicesToDelete([
                                  ...servicesToDelete,
                                  ...serviceToDelete
                                ])

                                return
                              }
                              return true
                            })
                          if (duplicateServiceValidation.includes(null)) {
                            return notification(
                              'Este combo tem serviços presentes em outros combos!',
                              'error'
                            )
                          }

                          if (
                            duplicatePlanValidation?.includes(undefined) ||
                            duplicateProductValidation?.includes(undefined) ||
                            duplicateServiceValidation?.includes(undefined)
                          ) {
                            setOpenModal(true)
                            setComboPositions(itemPosition)
                            setItemGroupIndex(index)
                            return
                          }
                        }

                        const comboValue = watch('item' + itemPosition)?.key
                        const productsUpSelling =
                          comboValue?.OportunidadesDeProdutos?.map(
                            (item: { Id: string }) => item.Id
                          )

                        const servicesUpSelling =
                          comboValue?.OportunidadesDeServicos?.map(
                            (item: { Id: string }) => item.Id
                          )
                        switch (watch('tipo' + itemPosition).key) {
                          case 'plans':
                            await createProposalPlan({
                              variables: {
                                Plano_Id: watch('item' + itemPosition).key.Id,
                                PlanoPreco_Id: watch('item' + itemPosition).key
                                  .Precos[0].Id,
                                Veiculo_Id: vehicleId,
                                Veiculo: vehicleNumber
                              }
                            }).then(() => proposalRefetch())
                            break
                          case 'products':
                            await createProposalProduct({
                              variables: {
                                Produto_Id: watch('item' + itemPosition).key.Id,
                                ProdutoPreco_Id: watch('item' + itemPosition)
                                  .key.Fornecedores[0].Precos[0].Id,
                                Veiculo_Id: vehicleId,
                                Veiculo: vehicleNumber
                              }
                            }).then(() => proposalRefetch())
                            break
                          case 'services':
                            await createProposalService({
                              variables: {
                                Servico_Id: watch('item' + itemPosition).key.Id,
                                ServicosPreco_Id: watch('item' + itemPosition)
                                  .key.Fornecedores[0].Precos[0].Id,
                                Veiculo_Id: vehicleId,
                                Veiculo: vehicleNumber
                              }
                            }).then(() => proposalRefetch())
                            break
                          case 'combos':
                            UpSellings.map(async (upselling) => {
                              if (
                                servicesUpSelling.includes(
                                  upselling.OportunidadeServico_Id as string
                                ) ||
                                productsUpSelling.includes(
                                  upselling.OportunidadeProduto_Id as string
                                )
                              ) {
                                await createProposalUpSelling({
                                  variables: {
                                    OportunidadeProduto_Id:
                                      upselling.OportunidadeProduto_Id,
                                    OportunidadeServico_Id:
                                      upselling.OportunidadeServico_Id,
                                    Veiculo: vehicleNumber
                                  }
                                })
                              }
                            })
                            await createProposalCombo({
                              variables: {
                                Combo_Id: watch('item' + itemPosition).key.Id,
                                ComboPreco_Id: watch('item' + itemPosition).key
                                  .Precos[0].Id,
                                Veiculo_Id: vehicleId,
                                Veiculo: vehicleNumber
                              }
                            }).then(() => proposalRefetch())

                            break
                        }
                        itensGroup[index] = 0
                        setReload(!reload)
                        refetch()
                      } catch (error: any) {
                        showError(error)
                      }
                    }}
                    type="button"
                    className="w-10 h-7"
                    disabled={disableInlineButton()}
                    loading={disableInlineButton()}
                  />
                )}

                {(itemPosition !== 1 || inLineSubmit) && (
                  <buttons.DeleteButton
                    onClick={() => {
                      itensGroup[index] = 0
                      setReload(!reload)
                    }}
                    disabled={disableInlineButton()}
                    loading={disableInlineButton()}
                  />
                )}
              </div>
              {watch('item' + itemPosition) ? (
                <div>
                  {watch('tipo' + itemPosition).key === 'combos' && (
                    <div>
                      <p>
                        {getPlansDependencies(watch('item' + itemPosition).key)}
                      </p>
                    </div>
                  )}
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
              {watch('tipo' + itemPosition) ? (
                watch('tipo' + itemPosition).key === 'combos' &&
                watch('item' + itemPosition) ? (
                  <>
                    {(
                      watch('item' + itemPosition).key.OportunidadesDeProdutos
                        ? watch('item' + itemPosition).key
                            .OportunidadesDeProdutos.length > 0
                        : false ||
                          watch('item' + itemPosition).key
                            .OportunidadesDeServicos
                        ? watch('item' + itemPosition).key
                            .OportunidadesDeServicos.length > 0
                        : false
                    ) ? (
                      <common.Separator className="my-0" />
                    ) : null}

                    <div className="grid grid-cols-2 gap-4">
                      {watch('item' + itemPosition).key
                        .OportunidadesDeProdutos ? (
                        watch('item' + itemPosition).key.OportunidadesDeProdutos
                          .length > 0 ? (
                          <div>
                            <p className="text-lg">Oportunidades de produtos</p>
                            {watch(
                              'item' + itemPosition
                            ).key.OportunidadesDeProdutos.map(
                              (
                                item: {
                                  Id: string
                                  Nome: string
                                  Valor: string
                                },
                                index: number
                              ) => (
                                <div key={item.Id}>
                                  <div className="w-full border-b border-gray-200 dark:border-dark-5 my-0.5" />
                                  <div className="flex items-center justify-between gap-4 mt-2">
                                    <div className="flex gap-4">
                                      <p>{item.Nome}</p>
                                      <p>{BRLMoneyFormat(item.Valor)}</p>
                                    </div>
                                    <form.Switch
                                      onChange={() => {
                                        if (watch('switch' + index + item.Id)) {
                                          setUpSellings(
                                            UpSellings.filter(
                                              (upSelling) =>
                                                upSelling.OportunidadeProduto_Id !==
                                                item.Id
                                            )
                                          )
                                          setValue(
                                            'switch' + index + item.Id,
                                            false
                                          )
                                          return
                                        }

                                        setUpSellings([
                                          ...UpSellings,
                                          {
                                            OportunidadeProduto_Id: item.Id,
                                            OportunidadeServico_Id: null,
                                            Veiculo: 1
                                          }
                                        ])
                                        setValue(
                                          'switch' + index + item.Id,
                                          true
                                        )
                                      }}
                                      value={watch('switch' + index + item.Id)}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : null
                      ) : null}

                      {watch('item' + itemPosition).key
                        .OportunidadesDeServicos ? (
                        watch('item' + itemPosition).key.OportunidadesDeServicos
                          .length > 0 ? (
                          <div>
                            <p className="text-lg">Oportunidades de serviços</p>
                            {watch(
                              'item' + itemPosition
                            ).key.OportunidadesDeServicos.map(
                              (item: {
                                Id: string
                                Nome: string
                                Valor: string
                              }) => (
                                <div key={item.Id}>
                                  <div className="w-full border-b border-gray-200 dark:border-dark-5 my-0.5" />
                                  <div className="flex items-center justify-between gap-4 mt-2">
                                    <div className="flex gap-4">
                                      <p>{item.Nome}</p>
                                      <p>{BRLMoneyFormat(item.Valor)}</p>
                                    </div>
                                    <form.Switch
                                      onChange={() => {
                                        if (
                                          watch('switch2' + index + item.Id)
                                        ) {
                                          setUpSellings(
                                            UpSellings.filter(
                                              (upSelling) =>
                                                upSelling.OportunidadeServico_Id !==
                                                item.Id
                                            )
                                          )
                                          setValue(
                                            'switch2' + index + item.Id,
                                            false
                                          )
                                          return
                                        }

                                        setUpSellings([
                                          ...UpSellings,
                                          {
                                            OportunidadeServico_Id: item.Id,
                                            OportunidadeProduto_Id: null,
                                            Veiculo: 1
                                          }
                                        ])
                                        setValue(
                                          'switch2' + index + item.Id,
                                          true
                                        )
                                      }}
                                      value={watch('switch2' + index + item.Id)}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : null
                      ) : null}
                    </div>
                  </>
                ) : null
              ) : null}
            </form.FormLine>
          )
      )}

      {showAddFormButton() && (
        <common.AddForm
          array={itensGroup}
          setArray={setItensGroup}
          lastNumber={lastNumber}
        >
          Adicionar outro item
        </common.AddForm>
      )}
      {!inLineSubmit && (
        <div
          className={`flex items-center ${
            hideBackButton ? 'justify-end' : 'justify-between'
          } w-full px-6 mt-4`}
        >
          {!hideBackButton && <buttons.GoBackButton />}

          <buttons.PrimaryButton
            title="Cadastrar"
            disabled={createLoading ? createLoading : createProposalLoading}
            onClick={handleSubmit(onSubmit)}
            loading={createLoading ? createLoading : createProposalLoading}
          />
        </div>
      )}

      <common.Modal
        handleSubmit={modalSubmit}
        open={openModal}
        disabled={
          deleteProposalServiceLoading ||
          deleteProposalPlanLoading ||
          deleteProposalProductLoading
        }
        description="Deseja adicionar esse combo e excluir estes itens avulsos?"
        onClose={() => {
          setOpenModal(false)
          setProductsToDelete([])
          setPlansToDelete([])
          setProductsToDelete([])
          setServicesToDelete([])
        }}
        buttonTitle="Adicionar combo"
        modalTitle="Adicionar combo e excluir itens?"
        color="red"
      >
        <div className="my-2">
          {plansToDelete.length > 0 ? (
            <>
              <common.Separator />
              <h3 className="text-xl">Planos:</h3>
            </>
          ) : null}
          {plansToDelete.map((plan) => (
            <p className="text-base" key={plan.Id}>
              {plan.Plano.Nome}
            </p>
          ))}

          {productsToDelete.length > 0 ? (
            <>
              <common.Separator />
              <h3 className="text-xl">Produtos:</h3>
            </>
          ) : null}
          {productsToDelete.map((product) => (
            <p className="text-base" key={product.Id}>
              {product.Produto.Nome}
            </p>
          ))}

          {servicesToDelete.length > 0 ? (
            <>
              <common.Separator />
              <h3 className="text-xl">Servicos:</h3>
            </>
          ) : null}
          {servicesToDelete.map((service) => (
            <p className="text-base" key={service.Id}>
              {service.Servico.Nome}
            </p>
          ))}
        </div>
      </common.Modal>
    </common.Card>
  )
}

export default CreateProposal
