import * as common from '@/common'
import * as form from '@/common/Form'
import * as icons from '@/common/Icons'
import * as proposals from '@/domains/erp/commercial/Proposals'
import * as buttons from '@/common/Buttons'
import * as combos from '@/domains/erp/commercial/Combos'
import * as plans from '@/domains/erp/commercial/Plans'
import * as products from '@/domains/erp/commercial/Products'
import * as services from '@/domains/erp/commercial/Services'
import * as vehicles from '@/domains/erp/services/Vehicles'
import { BRLMoneyFormat, BRLMoneyInputDefaultFormat } from 'utils/formaters'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type ViewVehicleType = {
  proposalData?: proposals.ProposalsArray
  proposalDataLoading: boolean
  vehicle: {
    Id: null | string
    content: { title: string; subtitle: string }
    position: number
  }
  refetchArraysData: (value?: string) => Promise<void>
  proposalRefetch: () => void
  licensePlates: string[]
}

type SelectItem = {
  key: any
  title: string
}

const ViewVehicle = ({
  proposalDataLoading,
  proposalData,
  vehicle,
  refetchArraysData,
  proposalRefetch,
  licensePlates
}: ViewVehicleType) => {
  const [activeEdit, setActiveEdit] = useState(false)
  const [plansArray, setPlansArray] = useState<SelectItem[]>([])
  const [plansPosition, setPlansPositions] = useState<number[]>([])
  const [productsArray, setProductsArray] = useState<SelectItem[]>([])
  const [productsPosition, setProductsPositions] = useState<number[]>([])
  const [servicesArray, setServicesArray] = useState<SelectItem[]>([])
  const [servicesPosition, setServicesPositions] = useState<number[]>([])
  const [combosArray, setCombosArray] = useState<SelectItem[]>([])
  const [combosPosition, setCombosPositions] = useState<number[]>([])
  const [itensAmount, setItensAmount] = useState<number[]>([])
  const [proposalInstallationsData, setProposalInstallationsData] =
    useState<{ Endereco: unknown; Id: string }>()
  const [UpSellings, setUpSellings] = useState<
    {
      OportunidadeProduto_Id: string | null
      OportunidadeServico_Id: string | null
      Veiculo: number
      Veiculo_Id: string | null
    }[]
  >([])
  const [unselectedVehicles, setUnselectedVehicles] = useState<
    {
      Id: string
      Placa?: string
      NumeroDoChassi?: string
      Categoria: { Id: string; Nome: string }
      Cliente?: { Id: string; Pessoa: { Nome: string } }
    }[]
  >([])
  let action = 'update'

  const { handleSubmit, control, setValue, watch } = useForm()
  const {
    updateProposalCombo,
    updateProposalComboLoading,
    updateProposalPlan,
    updateProposalPlanLoading,
    updateProposalProduct,
    updateProposalProductLoading,
    updateProposalService,
    updateProposalServiceLoading,
    updateProposalUpSelling,
    updateProposalUpSellingLoading,
    updateProposalInstalation,
    updateProposalInstalationLoading,
    createProposalUpSelling,
    createProposalUpSellingLoading,
    deleteProposalCombo,
    deleteProposalPlan,
    deleteProposalProduct,
    deleteProposalService,
    deleteProposalUpSelling,
    deleteProposalPlanLoading,
    deleteProposalProductLoading,
    deleteProposalServiceLoading,
    deleteProposalComboLoading,
    deleteProposalUpSellingLoading,
    setSlidePanelState: setAdressSlidePanelState,
    getProposalInstallationByVehiclePosition,
    proposalInstallationsRefetch,
    deleteProposalInstalation
  } = proposals.useView()
  const { combosData } = combos.useList()
  const { plansData } = plans.useList()
  const { productsData } = products.useProduct()
  const { servicesData } = services.useService()
  const { vehiclesData, setSlidePanelState } = vehicles.useVehicle()

  function onSubmit(data: any) {
    if (action === 'delete') {
      proposalData?.Planos.map(async (plan) => {
        await deleteProposalPlan({
          variables: {
            Id: plan.Id
          }
        })
      })

      proposalData?.Produtos.map(async (product) => {
        await deleteProposalProduct({
          variables: {
            Id: product.Id
          }
        })
      })

      proposalData?.Servicos.map(async (service) => {
        await deleteProposalService({
          variables: {
            Id: service.Id
          }
        })
      })

      proposalData?.Combos.map(async (combo) => {
        await deleteProposalCombo({
          variables: {
            Id: combo.Id
          }
        })
      })

      proposalData?.Oportunidades.map(async (upSelling) => {
        await deleteProposalUpSelling({
          variables: {
            Id: upSelling.Id
          }
        })
      })

      if (proposalInstallationsData) {
        deleteProposalInstalation({
          variables: {
            Id: proposalInstallationsData.Id
          }
        })
      }

      refetchArraysData('delete')
      notification(
        `${vehicle.content.title} ${vehicle.position} Excluido com sucesso`,
        'success'
      )
      setActiveEdit(false)
      return
    }

    let comboPlansNamesArray: string[] | undefined = []
    const finalComboPlansNameArray: string[] = []
    let comboProductsNamesArray: string[] | undefined = []
    const finalComboProductsNameArray: string[] = []
    let comboServicesNamesArray: string[] | undefined = []
    const finalComboServicesNameArray: string[] = []

    proposalData?.Combos.map((combo) => {
      comboPlansNamesArray = combo.Combo.Planos.map(
        (plan: { Plano: { Nome: string } }) => plan.Plano.Nome
      )
      comboProductsNamesArray = combo.Combo.Produtos.map(
        (product: { Produto: { Nome: string } }) => product.Produto.Nome
      )
      comboServicesNamesArray = combo.Combo.Servicos.map(
        (service: { Servico: { Nome: string } }) => service.Servico.Nome
      )

      finalComboPlansNameArray.push(...(comboPlansNamesArray as string[]))

      finalComboProductsNameArray.push(...comboProductsNamesArray)

      finalComboServicesNameArray.push(...comboServicesNamesArray)
    })

    const duplicatePlanValidation = proposalData?.Planos.map((_, index) => {
      if (finalComboPlansNameArray.includes(watch('item1' + index).title)) {
        return
      }
      return true
    })

    const duplicateProductValidation = proposalData?.Produtos.map(
      (_, index) => {
        if (
          finalComboProductsNameArray.includes(watch('item2' + index).title)
        ) {
          return
        }
        return true
      }
    )

    const duplicateServiceValidation = proposalData?.Servicos.map(
      (_, index) => {
        if (
          finalComboServicesNameArray.includes(watch('item3' + index).title)
        ) {
          return
        }
        return true
      }
    )

    if (duplicatePlanValidation?.includes(undefined)) {
      return notification(
        'Remova os planos que já estão inclusos no combo',
        'error'
      )
    }

    if (duplicateProductValidation?.includes(undefined)) {
      return notification(
        'Remova os produtos que já estão inclusos no combo',
        'error'
      )
    }

    if (duplicateServiceValidation?.includes(undefined)) {
      return notification(
        'Remova os serviços que já estão inclusos no combo',
        'error'
      )
    }

    proposalData?.Planos.map(async (plan, index) => {
      await updateProposalPlan({
        variables: {
          Plano_Id: data['item1' + index].key.Plano
            ? data['item1' + index].key.Plano.Id
            : data['item1' + index].key.Id,
          PlanoPreco_Id: data['item1' + index].key.Plano
            ? data['item1' + index].key.PlanoPreco.Id
            : data['item1' + index].key.Precos[0].Id,
          Id: plan.Id,
          Veiculo_Id: plan.VeiculoRelacionamento?.Id || null
        }
      })
    })

    proposalData?.Produtos.map(async (product, index) => {
      await updateProposalProduct({
        variables: {
          Produto_Id: data['item2' + index].key.Produto
            ? data['item2' + index].key.Produto.Id
            : data['item2' + index].key.Id,
          ProdutoPreco_Id: data['item2' + index].key.Produto
            ? data['item2' + index].key.ProdutoPreco.Id
            : data['item2' + index].key.Fornecedores[0].Precos[0].Id,
          Id: product.Id,
          Veiculo_Id: product.VeiculoRelacionamento?.Id || null
        }
      })
    })

    proposalData?.Servicos.map(async (service, index) => {
      await updateProposalService({
        variables: {
          Servico_Id: data['item3' + index].key.Servico
            ? data['item3' + index].key.Servico.Id
            : data['item3' + index].key.Id,
          ServicosPreco_Id: data['item3' + index].key.Servico
            ? data['item3' + index].key.ServicosPreco.Id
            : data['item3' + index].key.Fornecedores[0].Precos[0].Id,
          Id: service.Id,
          Veiculo_Id: service.VeiculoRelacionamento?.Id || null
        }
      })
    })

    proposalData?.Combos.map(async (combo, index) => {
      await updateProposalCombo({
        variables: {
          Combo_Id: data['item4' + index].key.Combo
            ? data['item4' + index].key.Combo.Id
            : data['item4' + index].key.Id,
          ComboPreco_Id: data['item4' + index].key.Combo
            ? data['item4' + index].key.ComboPreco.Id
            : data['item4' + index].key.Precos[0].Id,
          Id: combo.Id,
          Veiculo_Id: combo.VeiculoRelacionamento?.Id || null
        }
      })
    })

    const servicesUpsellings = proposalData?.Oportunidades.map(
      (opportunities) => opportunities.OportunidadeDeServico?.Id
    )
    const productsUpsellings = proposalData?.Oportunidades.map(
      (opportunities) => opportunities.OportunidadeDeProduto?.Id
    )

    UpSellings.map(async (upSelling) => {
      if (
        servicesUpsellings?.includes(
          upSelling.OportunidadeServico_Id as string
        ) ||
        productsUpsellings?.includes(upSelling.OportunidadeProduto_Id as string)
      ) {
        return
      }
      await createProposalUpSelling({
        variables: {
          OportunidadeProduto_Id: upSelling.OportunidadeProduto_Id,
          OportunidadeServico_Id: upSelling.OportunidadeServico_Id,
          Veiculo: upSelling.Veiculo
        }
      })
    })

    const servicesUpSellingState = UpSellings.map(
      (upSelling) => upSelling.OportunidadeServico_Id
    )

    const productsUpSellingState = UpSellings.map(
      (upSelling) => upSelling.OportunidadeProduto_Id
    )

    proposalData?.Oportunidades.map((opportunities) => {
      if (opportunities.Veiculo === vehicle.position) {
        if (
          servicesUpSellingState.includes(
            opportunities.OportunidadeDeServico?.Id as string
          ) ||
          productsUpSellingState.includes(
            opportunities.OportunidadeDeProduto?.Id as string
          )
        ) {
          return
        }
        deleteProposalUpSelling({
          variables: {
            Id: opportunities.Id
          }
        })
      }
    })

    refetchArraysData()
    notification(
      `${vehicle.content.title} ${vehicle.position} Editado com sucesso`,
      'success'
    )
    setActiveEdit(false)
  }

  function disableMainButton() {
    return (
      updateProposalComboLoading ||
      updateProposalPlanLoading ||
      updateProposalProductLoading ||
      updateProposalServiceLoading ||
      updateProposalUpSellingLoading ||
      createProposalUpSellingLoading ||
      proposalDataLoading
    )
  }

  function disabledDeleteButtons() {
    return (
      deleteProposalPlanLoading ||
      deleteProposalProductLoading ||
      deleteProposalServiceLoading ||
      deleteProposalComboLoading ||
      deleteProposalUpSellingLoading ||
      proposalDataLoading
    )
  }

  function getServicesDependencies(value: any, type: string) {
    let array: string[] = []
    switch (type) {
      case 'plans':
        return `Serviços inclusos: ${
          value.Plano ? value.Plano.Servico.Nome : value.Servico.Nome
        }`

      case 'products':
        array = (
          value.Produto
            ? value.Produto.Servicos_Produtos
            : value.Servicos_Produtos
        ).map(
          (item: {
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        if (array.length === 0) return
        return `Serviços inclusos: ${array.map((item: string) => ' ' + item)}`

      case 'services':
        array = (
          value.Servico
            ? value.Servico.servicosServicos
            : value.servicosServicos
        ).map(
          (item: {
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        if (array.length === 0) return
        return `Serviços inclusos: ${array.map((item: string) => ' ' + item)}`

      case 'combos':
        array = (value.Combo ? value.Combo.Servicos : value.Servicos).map(
          (item: {
            Servico: {
              Nome: string
            }
          }) => item.Servico.Nome
        )
        ;(value.Combo ? value.Combo.Combos : value.Combos).map(
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

  function getProductsDependencies(value: any, type: string) {
    let array: string[] = []
    switch (type) {
      case 'products':
        array = (
          value.Produto
            ? value.Produto.ProdutosQueDependo
            : value.ProdutosQueDependo
        ).map(
          (item: {
            ProdutoDependente: {
              Nome: string
            }
          }) => item.ProdutoDependente.Nome
        )
        if (array.length === 0) return
        return `Produtos inclusos: ${array.map((item: string) => ' ' + item)}`

      case 'services':
        array = (
          value.Servico
            ? value.Servico.Produtos_Servicos
            : value.Produtos_Servicos
        ).map(
          (item: {
            Produto: {
              Nome: string
            }
          }) => item.Produto.Nome
        )
        if (array.length === 0) return
        return `Produtos inclusos: ${array.map((item: string) => ' ' + item)}`

      case 'combos':
        array = (value.Combo ? value.Combo.Produtos : value.Produtos).map(
          (item: {
            Produto: {
              Nome: string
            }
          }) => item.Produto.Nome
        )
        ;(value.Combo ? value.Combo.Combos : value.Combos).map(
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

    array = (value?.Combo ? value?.Combo.Planos : value?.Planos).map(
      (item: {
        Plano: {
          Nome: string
        }
      }) => item.Plano.Nome
    )
    ;(value.Combo ? value.Combo.Combos : value.Combos).map(
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

  function removeUpSellingOnChangeType(index: number) {
    const item = watch('item4' + index)
    const comboValue = item?.key?.Combo ? item?.key.Combo : item?.key
    let finalValue: {
      OportunidadeProduto_Id: string | null
      OportunidadeServico_Id: string | null
      Veiculo: number
      Veiculo_Id: string | null
    }[] = []

    comboValue?.OportunidadesDeProdutos?.map(
      (item: { Id: string; Nome: string }) => {
        finalValue = (finalValue.length > 0 ? finalValue : UpSellings).filter(
          (upSelling) => upSelling.OportunidadeProduto_Id !== item.Id
        )

        setValue('switch4' + item.Id + vehicle.position, false)
      }
    )

    comboValue?.OportunidadesDeServicos?.map(
      (item: { Id: string; Nome: string }) => {
        finalValue = finalValue.filter(
          (upSelling) => upSelling.OportunidadeServico_Id !== item.Id
        )

        setValue('switch24' + item.Id + vehicle.position, false)
      }
    )
    setUpSellings(finalValue)
  }

  function renderDependencies(
    itemPosition: string,
    index: number,
    type: string
  ) {
    return watch('item' + itemPosition + index) ? (
      <div>
        {type === 'combos' && (
          <div>
            <p>
              {getPlansDependencies(watch('item' + itemPosition + index)?.key)}
            </p>
          </div>
        )}
        <div>
          <p>
            {getServicesDependencies(
              watch('item' + itemPosition + index)?.key,
              type
            )}
          </p>
        </div>

        {type !== 'plans' && (
          <p>
            {getProductsDependencies(
              watch('item' + itemPosition + index)?.key,
              type
            )}
          </p>
        )}
      </div>
    ) : null
  }

  function renderUpSellings(index: number) {
    const combo = watch('item4' + index)?.key.Combo
      ? watch('item4' + index)?.key.Combo
      : watch('item4' + index)?.key

    return watch('item4' + index) ? (
      <>
        {(
          combo.OportunidadesDeProdutos
            ? combo.OportunidadesDeProdutos.length > 0
            : false || combo.OportunidadesDeServicos
            ? combo.OportunidadesDeServicos.length > 0
            : false
        ) ? (
          <common.Separator className="my-0" />
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          {combo.OportunidadesDeProdutos ? (
            combo.OportunidadesDeProdutos.length > 0 ? (
              <div>
                <p className="text-lg">Oportunidades de produtos</p>
                {combo.OportunidadesDeProdutos.map(
                  (item: { Id: string; Nome: string; Valor: string }) => (
                    <div key={item.Id}>
                      <div className="w-full border-b border-gray-200 dark:border-dark-5 my-0.5" />
                      <div className="flex items-center justify-between gap-4 mt-2">
                        <div className="flex gap-4">
                          <p>{item.Nome}</p>
                          <p>{BRLMoneyFormat(item.Valor)}</p>
                        </div>
                        {activeEdit && (
                          <form.Switch
                            onChange={() => {
                              if (
                                watch('switch4' + item.Id + vehicle.position)
                              ) {
                                setUpSellings(
                                  UpSellings.filter(
                                    (upSelling) =>
                                      upSelling.OportunidadeProduto_Id !==
                                      item.Id
                                  )
                                )
                                setValue(
                                  'switch4' + item.Id + vehicle.position,
                                  false
                                )
                                return
                              }

                              setUpSellings([
                                ...UpSellings,
                                {
                                  OportunidadeProduto_Id: item.Id,
                                  OportunidadeServico_Id: null,
                                  Veiculo: vehicle.position,
                                  Veiculo_Id: combo.VeiculoRelacionamento
                                    ?.Id as string | null
                                }
                              ])
                              setValue(
                                'switch4' + item.Id + vehicle.position,
                                true
                              )
                            }}
                            value={watch(
                              'switch4' + item.Id + vehicle.position
                            )}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : null
          ) : null}

          {combo.OportunidadesDeServicos ? (
            combo.OportunidadesDeServicos.length > 0 ? (
              <div>
                <p className="text-lg">Oportunidades de serviços</p>
                {combo.OportunidadesDeServicos.map(
                  (item: { Id: string; Nome: string; Valor: string }) => (
                    <div key={item.Id}>
                      <div className="w-full border-b border-gray-200 dark:border-dark-5 my-0.5" />
                      <div className="flex items-center justify-between gap-4 mt-2">
                        <div className="flex gap-4">
                          <p>{item.Nome}</p>
                          <p>{BRLMoneyFormat(item.Valor)}</p>
                        </div>
                        {activeEdit && (
                          <form.Switch
                            onChange={() => {
                              if (
                                watch('switch24' + item.Id + vehicle.position)
                              ) {
                                setUpSellings(
                                  UpSellings.filter(
                                    (upSelling) =>
                                      upSelling.OportunidadeServico_Id !==
                                      item.Id
                                  )
                                )
                                setValue(
                                  'switch24' + item.Id + vehicle.position,
                                  false
                                )
                                return
                              }

                              setUpSellings([
                                ...UpSellings,
                                {
                                  OportunidadeServico_Id: item.Id,
                                  OportunidadeProduto_Id: null,
                                  Veiculo: vehicle.position,
                                  Veiculo_Id: combo.VeiculoRelacionamento
                                    ?.Id as string | null
                                }
                              ])
                              setValue(
                                'switch24' + item.Id + vehicle.position,
                                true
                              )
                            }}
                            value={watch(
                              'switch24' + item.Id + vehicle.position
                            )}
                          />
                        )}
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
  }

  async function removeItem(type: string, item: any) {
    try {
      let itemName = ''
      const comboValue = item.Combo ? item.Combo : item
      const productsUpSelling = comboValue?.OportunidadesDeProdutos?.map(
        (item: { Id: string }) => item.Id
      )

      const servicesUpSelling = comboValue?.OportunidadesDeServicos?.map(
        (item: { Id: string }) => item.Id
      )

      switch (type) {
        case 'plans':
          await deleteProposalPlan({
            variables: {
              Id: item.Id
            }
          })
          itemName = 'Plano'
          break
        case 'products':
          await deleteProposalProduct({
            variables: {
              Id: item.Id
            }
          })
          itemName = 'Produto'
          break
        case 'services':
          await deleteProposalService({
            variables: {
              Id: item.Id
            }
          })
          itemName = 'Serviço'
          break
        case 'combos':
          await deleteProposalCombo({
            variables: {
              Id: item.Id
            }
          })
          proposalData?.Oportunidades.map((opportunities) => {
            if (
              servicesUpSelling.includes(
                opportunities.OportunidadeDeServico?.Id as string
              ) ||
              productsUpSelling.includes(
                opportunities.OportunidadeDeProduto?.Id as string
              )
            ) {
              deleteProposalUpSelling({
                variables: {
                  Id: opportunities.Id
                }
              })
            }
          })
          itemName = 'Combo'
          break
      }
      setActiveEdit(false)
      refetchArraysData()
      notification(itemName + ' excluido com sucesso', 'success')
    } catch (error: any) {
      showError(error)
    }
  }

  async function linkVehicle() {
    proposalData?.Planos.map(async (plan) => {
      if (plan.Veiculo === vehicle.position) {
        await updateProposalPlan({
          variables: {
            Plano_Id: plan.Plano.Id,
            Id: plan.Id,
            PlanoPreco_Id: plan.PlanoPreco.Id,
            Veiculo_Id: watch('Veiculo_Id123' + vehicle.position).key
          }
        })
      }
    })

    proposalData?.Produtos.map(async (product) => {
      if (product.Veiculo === vehicle.position) {
        await updateProposalProduct({
          variables: {
            Produto_Id: product.Produto.Id,
            ProdutoPreco_Id: product.ProdutoPreco.Id,
            Id: product.Id,
            Veiculo_Id: watch('Veiculo_Id123' + vehicle.position).key
          }
        })
      }
    })

    proposalData?.Servicos.map(async (service) => {
      if (service.Veiculo === vehicle.position) {
        await updateProposalService({
          variables: {
            Servico_Id: service.Servico.Id,
            ServicosPreco_Id: service.ServicosPreco.Id,
            Id: service.Id,
            Veiculo_Id: watch('Veiculo_Id123' + vehicle.position).key
          }
        })
      }
    })

    proposalData?.Combos.map(async (combo) => {
      if (combo.Veiculo === vehicle.position) {
        await updateProposalCombo({
          variables: {
            Combo_Id: combo.Combo.Id,
            ComboPreco_Id: combo.ComboPreco.Id,
            Id: combo.Id,
            Veiculo_Id: watch('Veiculo_Id123' + vehicle.position).key
          }
        })
      }
    })

    proposalData?.Oportunidades.map(async (opportunities) => {
      if (opportunities.Veiculo === vehicle.position) {
        await updateProposalUpSelling({
          variables: {
            Id: opportunities.Id,
            Veiculo_Id: watch('Veiculo_Id123' + vehicle.position).key
          }
        })
      }
    })

    if (proposalInstallationsData) {
      await updateProposalInstalation({
        variables: {
          Id: proposalInstallationsData?.Id,
          Endereco: proposalInstallationsData?.Endereco,
          Veiculo_Id: watch('Veiculo_Id123' + vehicle.position).key
        }
      })
    }

    proposalInstallationsRefetch()
    refetchArraysData()
    proposalRefetch()
    notification('Veículo vinculado com sucesso', 'success')
    setActiveEdit(false)
  }

  function getVehicleDefaultValue() {
    if (proposalData?.Planos[0]?.VeiculoRelacionamento) {
      const planVehicle = proposalData?.Planos[0]?.VeiculoRelacionamento
      setValue('Veiculo_Id123' + vehicle.position, {
        key: planVehicle?.Id,
        title:
          (planVehicle?.Placa !== null
            ? planVehicle.Placa
            : planVehicle.NumeroDoChassi?.substring(0, 10)) +
          ' - ' +
          planVehicle?.Categoria.Nome
      })
      return
    }

    if (proposalData?.Produtos[0]?.VeiculoRelacionamento) {
      const productVehicle = proposalData?.Produtos[0]?.VeiculoRelacionamento
      setValue('Veiculo_Id123' + vehicle.position, {
        key: productVehicle?.Id,
        title:
          (productVehicle?.Placa !== null
            ? productVehicle.Placa
            : productVehicle.NumeroDoChassi?.substring(0, 10)) +
          ' - ' +
          productVehicle?.Categoria.Nome
      })
      return
    }

    if (proposalData?.Servicos[0]?.VeiculoRelacionamento) {
      const serviceVehicle = proposalData?.Servicos[0]?.VeiculoRelacionamento
      setValue('Veiculo_Id123' + vehicle.position, {
        key: serviceVehicle?.Id,
        title:
          (serviceVehicle?.Placa !== null
            ? serviceVehicle.Placa
            : serviceVehicle.NumeroDoChassi?.substring(0, 10)) +
          ' - ' +
          serviceVehicle?.Categoria.Nome
      })
      return
    }

    if (proposalData?.Combos[0]?.VeiculoRelacionamento) {
      const comboVehicle = proposalData?.Combos[0]?.VeiculoRelacionamento
      setValue('Veiculo_Id123' + vehicle.position, {
        key: comboVehicle?.Id,
        title:
          (comboVehicle?.Placa !== null
            ? comboVehicle.Placa
            : comboVehicle.NumeroDoChassi?.substring(0, 10)) +
          ' - ' +
          comboVehicle?.Categoria.Nome
      })
      return
    }

    if (proposalData?.Oportunidades[0]?.VeiculoRelacionamento) {
      const upSellingVehicle =
        proposalData?.Oportunidades[0]?.VeiculoRelacionamento
      setValue('Veiculo_Id123' + vehicle.position, {
        key: upSellingVehicle?.Id,
        title:
          (upSellingVehicle?.Placa !== null
            ? upSellingVehicle.Placa
            : upSellingVehicle.NumeroDoChassi?.substring(0, 10)) +
          ' - ' +
          upSellingVehicle?.Categoria.Nome
      })
      return
    }

    setValue('Veiculo_Id123' + vehicle.position, undefined)
  }

  function getTotalValue() {
    let totalPrice = 0

    proposalData?.Combos.map((combo) => {
      combo.Combo.Planos.map((plan: { ValorPraticado: string }) => {
        totalPrice += Number(plan.ValorPraticado)
      })
      combo.Combo.Produtos.map((product: { ValorPraticado: string }) => {
        totalPrice += Number(product.ValorPraticado)
      })
      combo.Combo.Servicos.map((service: { ValorPraticado: string }) => {
        totalPrice += Number(service.ValorPraticado)
      })
      combo.Combo.Combos.map((combo: { Valor: string }) => {
        totalPrice += Number(combo.Valor)
      })
      totalPrice += Number(combo.ComboPreco.ValorBase)
    })

    proposalData?.Planos.map((plans) => {
      totalPrice += Number(
        plans.PlanoPreco.ValorPraticado
          ? plans.PlanoPreco.ValorPraticado + plans.PlanoPreco.ValorBase
          : plans.PlanoPreco.ValorBase + plans.PlanoPreco.ServicoPreco.Valor
      )
    })

    proposalData?.Produtos.map((product) => {
      totalPrice += Number(product.ProdutoPreco.Valor)
    })

    proposalData?.Servicos.map((service) => {
      totalPrice += Number(service.ServicosPreco.Valor)
    })

    return BRLMoneyFormat(totalPrice)
  }

  function showPlanPrice(arrayPosition: number) {
    let planPrice = 0
    const plan = watch('item1' + arrayPosition).key
    if (plan.Plano) {
      planPrice = plan.PlanoPreco.ValorPraticado
        ? plan.PlanoPreco.ValorBase + plan.PlanoPreco.ValorPraticado
        : plan.PlanoPreco.ValorBase + plan.PlanoPreco.ServicoPreco.Valor
      return planPrice.toFixed(2)
    }
    planPrice = plan.Precos[0].ValorPraticado
      ? plan.Precos[0].ValorBase + plan.Precos[0].ValorPraticado
      : plan.Precos[0].ValorBase + plan.Precos[0].ServicoPreco.Valor

    return planPrice.toFixed(2)
  }

  function showProductPrice(arrayPosition: number) {
    if (watch('item2' + arrayPosition).key.Produto) {
      return watch('item2' + arrayPosition).key.ProdutoPreco.Valor.toFixed(2)
    }

    return watch(
      'item2' + arrayPosition
    ).key.Fornecedores[0].Precos[0].Valor.toFixed(2)
  }

  function showServicePrice(arrayPosition: number) {
    if (watch('item3' + arrayPosition).key.Servico) {
      return watch('item3' + arrayPosition).key.ServicosPreco.Valor.toFixed(2)
    }

    return watch(
      'item3' + arrayPosition
    ).key.Fornecedores[0].Precos[0].Valor.toFixed(2)
  }

  function showComboPrice(arrayPosition: number) {
    let totalPrice = 0
    const combo = watch('item4' + arrayPosition).key
    if (combo.Combo) {
      combo.Combo.Planos.map((plan: { ValorPraticado: number }) => {
        totalPrice += plan.ValorPraticado
      })
      combo.Combo.Produtos.map((product: { ValorPraticado: number }) => {
        totalPrice += product.ValorPraticado
      })
      combo.Combo.Servicos.map((service: { ValorPraticado: number }) => {
        totalPrice += service.ValorPraticado
      })
      combo.Combo.Combos.map((combo: { Valor: number }) => {
        totalPrice += combo.Valor
      })
      totalPrice += combo.ComboPreco.ValorBase
      return totalPrice.toFixed(2)
    }
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
    totalPrice += combo.Precos[0].ValorBase

    return totalPrice.toFixed(2)
  }

  useEffect(() => {
    if (proposalData) {
      proposalData?.Oportunidades.map((upSelling) => {
        if (upSelling.OportunidadeDeProduto?.Id) {
          setValue(
            'switch4' + upSelling.OportunidadeDeProduto?.Id + upSelling.Veiculo,
            true
          )
        }
        if (upSelling.OportunidadeDeServico?.Id) {
          setValue(
            'switch24' +
              upSelling.OportunidadeDeServico?.Id +
              upSelling.Veiculo,
            true
          )
        }
      })

      if (UpSellings.length === 0) {
        const oldUpSellings = proposalData!.Oportunidades.map((upSelling) => {
          return {
            OportunidadeProduto_Id: upSelling.OportunidadeDeProduto
              ? upSelling.OportunidadeDeProduto.Id
              : null,
            OportunidadeServico_Id: upSelling.OportunidadeDeServico
              ? upSelling.OportunidadeDeServico.Id
              : null,
            Veiculo: upSelling.Veiculo,
            Veiculo_Id: upSelling.VeiculoRelacionamento?.Id as string | null
          }
        })
        setUpSellings([...UpSellings, ...oldUpSellings])
      }
    }
  }, [proposalData?.Oportunidades])

  useEffect(() => {
    const itensArray: number[] = []
    if (plansData) {
      const positions = proposalData?.Planos.map((_, index) => index)
      for (let index = 0; index < plansPosition.length; index++) {
        plansPosition.pop()
      }
      plansPosition.map(() => plansPosition.pop())
      positions?.map((position) => {
        itensArray.push(position)
        plansPosition.push(position)
      })

      setPlansPositions(positions as number[])
      plansPosition.map((position, index) => {
        setValue('item1' + position, {
          key: proposalData?.Planos[index],
          title: proposalData?.Planos[index]?.Plano.Nome
        })
      })

      setPlansArray(
        plansData.map((plan) => {
          return { key: plan, title: plan.Nome }
        })
      )
    }

    if (productsData) {
      const positions = proposalData?.Produtos.map((_, index) => index)
      for (let index = 0; index < productsPosition.length; index++) {
        productsPosition.pop()
      }
      positions?.map(() => productsPosition.pop())
      positions?.map((position) => {
        itensArray.push(position)
        productsPosition.push(position)
      })
      setProductsPositions(positions as number[])
      productsPosition.map((position, index) => {
        setValue('item2' + position, {
          key: proposalData?.Produtos[index],
          title: proposalData?.Produtos[index]?.Produto.Nome
        })
      })
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
      const positions = proposalData?.Servicos.map((_, index) => index)
      for (let index = 0; index < servicesPosition.length; index++) {
        servicesPosition.pop()
      }
      positions?.map(() => servicesPosition.pop())
      positions?.map((position) => {
        itensArray.push(position)
        servicesPosition.push(position)
      })
      setServicesPositions(positions as number[])
      servicesPosition.map((position, index) => {
        setValue('item3' + position, {
          key: proposalData?.Servicos[index],
          title: proposalData?.Servicos[index]?.Servico.Nome
        })
      })
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
      const positions = proposalData?.Combos.map((_, index) => index)
      for (let index = 0; index < combosPosition.length; index++) {
        combosPosition.pop()
      }
      positions?.map(() => combosPosition.pop())
      positions?.map((position) => {
        itensArray.push(position)
        combosPosition.push(position)
      })
      setCombosPositions(positions as number[])
      combosPosition.map((position, index) => {
        setValue('item4' + position, {
          key: proposalData?.Combos[index],
          title: proposalData?.Combos[index]?.Combo.Nome
        })
      })

      setCombosArray(
        combosData.map((combo) => {
          return {
            key: combo,
            title: combo.Nome
          }
        })
      )
    }
    setItensAmount(itensArray)
    getVehicleDefaultValue()
    setValue('Veiculo_Id', undefined)
    setActiveEdit(false)
  }, [plansData, productsData, servicesData, combosData, proposalData])

  useEffect(() => {
    if (vehiclesData) {
      setUnselectedVehicles(
        vehiclesData.filter(
          (vehicle) => !licensePlates.includes(vehicle.Placa as string)
        )
      )
    }
  }, [vehiclesData, proposalData])

  useEffect(() => {
    getProposalInstallationByVehiclePosition(vehicle.position).then(
      (vehicle) => {
        setProposalInstallationsData(vehicle?.[0])
      }
    )
  }, [vehicle.Id])

  return (
    <common.Card>
      <div className="flex">
        <div className="w-2/5">
          <common.GenericTitle
            title={
              <div>
                <p>Proposta do veículo:</p>
                <p>
                  {vehicle.content.subtitle !== 'Sem vínculo'
                    ? vehicle.content.subtitle
                    : vehicle.content.title}{' '}
                  {vehicle.content.subtitle === 'Sem vínculo'
                    ? vehicle.position
                    : ''}
                </p>
              </div>
            }
            subtitle="Selecione combos, planos, serviços e produtos"
            className="px-6"
          />
          <p className="px-6 mt-2 text-xl">Valor Total: {getTotalValue()}</p>
        </div>
        <div className="flex items-start justify-center w-3/5 gap-4">
          <div>
            {proposalInstallationsData !== undefined ? (
              <buttons.PrimaryButton
                onClick={() =>
                  setAdressSlidePanelState({
                    open: true,
                    type: 'updateAddress',
                    data: proposalInstallationsData
                  })
                }
                title={'Editar endereço'}
                type="button"
                disabled={proposalData?.Situacao.Valor !== 'criado'}
                className="my-0"
              />
            ) : (
              <buttons.SecondaryButton
                handler={() =>
                  setAdressSlidePanelState({
                    open: true,
                    type: 'createAddress',
                    data: {
                      Veiculo: vehicle.position,
                      Veiculo_Id: vehicle.Id
                    }
                  })
                }
                title={'Definir endereço'}
                type="button"
                disabled={proposalData?.Situacao.Valor !== 'criado'}
              />
            )}
          </div>
          <Controller
            control={control}
            name={'Veiculo_Id123' + vehicle.position}
            render={({ field: { onChange, value } }) => (
              <div className="flex-1">
                <form.Select
                  itens={
                    unselectedVehicles
                      ? unselectedVehicles.map((vehicle) => {
                          return {
                            key: vehicle.Id,
                            title:
                              (vehicle.Placa
                                ? vehicle.Placa
                                : vehicle.NumeroDoChassi?.substring(0, 10)) +
                              ' - ' +
                              vehicle.Categoria.Nome
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label={'Vincular veículo'}
                  disabled={proposalData?.Situacao.Valor !== 'criado'}
                />
                <common.OpenModalLink
                  onClick={() =>
                    setSlidePanelState({
                      open: true,
                      type: 'create'
                    })
                  }
                >
                  Cadastrar Veículo
                </common.OpenModalLink>
              </div>
            )}
          />
          <div className="mr-6">
            <buttons.SecondaryButton
              handler={linkVehicle}
              title={<icons.CheckIcon />}
              type="button"
              loading={updateProposalInstalationLoading}
              disabled={
                watch('Veiculo_Id123' + vehicle.position) === undefined ||
                proposalData?.Situacao.Valor !== 'criado' ||
                updateProposalInstalationLoading
              }
            />
          </div>
        </div>
      </div>
      <common.Separator />
      {plansPosition.map((plan, index) => (
        <form.FormLine position={index} grid={1} key={index}>
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-3">
              <form.Select
                itens={[]}
                value={{ key: 'plans', title: 'Plano' }}
                onChange={() => null}
                label="Tipo"
                disabled={true}
              />
            </div>

            <Controller
              control={control}
              name={'item1' + plan}
              defaultValue={{
                key: proposalData?.Planos[index],
                title: proposalData?.Planos[index]?.Plano.Nome
              }}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-3">
                  <form.Select
                    itens={plansArray}
                    value={value}
                    onChange={onChange}
                    label={'Plano'}
                    disabled={
                      !activeEdit || proposalData?.Situacao.Valor !== 'criado'
                    }
                  />
                </div>
              )}
            />

            <div className="col-span-2">
              <form.Input
                fieldName={'Valor'}
                title={`Valor`}
                value={BRLMoneyInputDefaultFormat(
                  watch('item1' + plan) ? showPlanPrice(plan) : '0'
                )}
                icon="R$"
                disabled
              />
            </div>
            {itensAmount.length > 1 &&
              proposalData?.Situacao.Valor === 'criado' && (
                <buttons.DeleteButton
                  onClick={() =>
                    removeItem('plans', watch('item1' + plan)?.key).then(() =>
                      proposalRefetch()
                    )
                  }
                  disabled={disabledDeleteButtons()}
                  loading={disabledDeleteButtons()}
                />
              )}
          </div>
          {renderDependencies('1', plan, 'plans')}
        </form.FormLine>
      ))}

      {productsPosition.map((product, index) => (
        <form.FormLine
          position={plansPosition.length + index}
          grid={1}
          key={index}
        >
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-3">
              <form.Select
                itens={[]}
                value={{ key: 'products', title: 'Produto' }}
                onChange={() => null}
                label="Tipo"
                disabled={true}
              />
            </div>

            <Controller
              control={control}
              name={'item2' + product}
              defaultValue={{
                key: proposalData?.Produtos[index],
                title: proposalData?.Produtos[index]?.Produto.Nome
              }}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-3">
                  <form.Select
                    itens={productsArray}
                    value={value}
                    onChange={onChange}
                    label={'Produto'}
                    disabled={
                      !activeEdit || proposalData?.Situacao.Valor !== 'criado'
                    }
                  />
                </div>
              )}
            />

            <div className="col-span-2">
              <form.Input
                fieldName={'Valor'}
                title={`Valor`}
                value={BRLMoneyInputDefaultFormat(
                  watch('item2' + product)
                    ? showProductPrice(product)
                    : undefined
                )}
                icon="R$"
                disabled
              />
            </div>

            {itensAmount.length > 1 &&
              proposalData?.Situacao.Valor === 'criado' && (
                <buttons.DeleteButton
                  onClick={() =>
                    removeItem('products', watch('item2' + product)?.key).then(
                      () => proposalRefetch()
                    )
                  }
                  disabled={disabledDeleteButtons()}
                  loading={disabledDeleteButtons()}
                />
              )}
          </div>
          {renderDependencies('2', product, 'products')}
        </form.FormLine>
      ))}
      {servicesPosition.map((service, index) => (
        <form.FormLine
          position={plansPosition.length + productsPosition.length + index}
          grid={1}
          key={index}
        >
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-3">
              <form.Select
                itens={[]}
                value={{ key: 'services', title: 'Serviço' }}
                onChange={() => null}
                label="Tipo"
                disabled={true}
              />
            </div>
            <Controller
              control={control}
              name={'item3' + service}
              defaultValue={{
                key: proposalData?.Servicos[index],
                title: proposalData?.Servicos[index]?.Servico.Nome
              }}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-3">
                  <form.Select
                    itens={servicesArray}
                    value={value}
                    onChange={onChange}
                    label={'Serviço'}
                    disabled={
                      !activeEdit || proposalData?.Situacao.Valor !== 'criado'
                    }
                  />
                </div>
              )}
            />

            <div className="col-span-2">
              <form.Input
                fieldName={'Valor'}
                title={`Valor`}
                value={BRLMoneyInputDefaultFormat(
                  watch('item3' + service)
                    ? showServicePrice(service)
                    : undefined
                )}
                icon="R$"
                disabled
              />
            </div>
            {itensAmount.length > 1 &&
              proposalData?.Situacao.Valor === 'criado' && (
                <buttons.DeleteButton
                  onClick={() =>
                    removeItem('services', watch('item3' + service)?.key).then(
                      () => proposalRefetch()
                    )
                  }
                  disabled={disabledDeleteButtons()}
                  loading={disabledDeleteButtons()}
                />
              )}
          </div>
          {renderDependencies('3', service, 'services')}
        </form.FormLine>
      ))}
      {combosPosition.map((combo, index) => (
        <form.FormLine
          position={
            plansPosition.length +
            productsPosition.length +
            servicesPosition.length +
            index
          }
          grid={1}
          key={index}
        >
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-3">
              <form.Select
                itens={[]}
                value={{ key: 'combos', title: 'Combo' }}
                onChange={() => null}
                label="Tipo"
                disabled={true}
              />
            </div>
            <Controller
              control={control}
              name={'item4' + combo}
              defaultValue={{
                key: proposalData?.Combos[index],
                title: proposalData?.Combos[index]?.Combo.Nome
              }}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-3">
                  <form.Select
                    itens={combosArray}
                    value={value}
                    onChange={(e) => {
                      removeUpSellingOnChangeType(combo)
                      onChange(e)
                    }}
                    label={'Combo'}
                    disabled={
                      !activeEdit || proposalData?.Situacao.Valor !== 'criado'
                    }
                  />
                </div>
              )}
            />
            <div className="col-span-2">
              <form.Input
                fieldName={'Valor'}
                title={`Valor`}
                value={BRLMoneyInputDefaultFormat(
                  watch('item4' + combo) ? showComboPrice(combo) : undefined
                )}
                icon="R$"
                disabled
              />
            </div>

            {itensAmount.length > 1 &&
              proposalData?.Situacao.Valor === 'criado' && (
                <buttons.DeleteButton
                  onClick={() =>
                    removeItem('combos', watch('item4' + combo)?.key).then(() =>
                      proposalRefetch()
                    )
                  }
                  disabled={disabledDeleteButtons()}
                  loading={disabledDeleteButtons()}
                />
              )}
          </div>
          {renderDependencies('4', combo, 'combos')}
          {renderUpSellings(combo)}
        </form.FormLine>
      ))}

      {activeEdit && (
        <Controller
          control={control}
          name={'Veiculo'}
          render={() => (
            <div className="col-span-5">
              <proposals.CreateVehicle
                onChange={() => null}
                vehicleName={'Veiculo'}
                vehicleNumber={vehicle.position}
                vehicleId={vehicle.Id}
                refetch={refetchArraysData}
                hideHeader
                hideBackButton
                inLineSubmit
                proposal={proposalData}
                proposalRefetch={proposalRefetch}
              />
            </div>
          )}
        />
      )}
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <div className="flex gap-2">
          {activeEdit && (
            <buttons.CancelButton
              onClick={() => {
                setActiveEdit(false)
                refetchArraysData()
              }}
            />
          )}
          {!activeEdit && vehicle.position !== 1 && (
            <buttons.CancelButton
              onClick={() => {
                action = 'delete'
                handleSubmit(onSubmit)()
              }}
              title="Excluir Veículo"
              disabled={disabledDeleteButtons()}
              loading={disabledDeleteButtons()}
            />
          )}

          {proposalData?.Situacao.Valor === 'criado' && (
            <buttons.PrimaryButton
              title={activeEdit ? 'Confirmar' : 'Editar'}
              disabled={disableMainButton() || disabledDeleteButtons()}
              loading={disableMainButton() || disabledDeleteButtons()}
              type="button"
              onClick={() => {
                if (!activeEdit) {
                  setActiveEdit(true)
                  return
                }
                action = 'update'
                handleSubmit(onSubmit)()
              }}
            />
          )}
        </div>
      </div>
      <vehicles.SlidePanel />
    </common.Card>
  )
}

export default ViewVehicle
