import * as common from '@/common'
import * as form from '@/common/Form'
import * as icons from '@/common/Icons'
import * as proposals from '@/domains/erp/commercial/Proposals'
import * as clients from '@/domains/erp/identities/Clients'
import * as blocks from '@/blocks'
import * as buttons from '@/common/Buttons'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { notification } from 'utils/notification'
import Skeleton from 'react-loading-skeleton'

const ProposalDetails = () => {
  const router = useRouter()
  const {
    proposalData,
    proposalRefetch,
    proposalLoading,
    getProposalArray,
    createProposalCombo,
    createProposalService,
    createProposalPlan,
    createProposalProduct,
    createProposalUpSelling,
    createProposalComboLoading,
    createProposalPlanLoading,
    createProposalProductLoading,
    createProposalServiceLoading,
    createProposalUpSellingLoading,
    acceptProposal,
    refuseProposal,
    setSlidePanelState,
    addClientToProposal
  } = proposals.useView()
  const { clientsData } = clients.useList()
  const { control, watch, setValue } = useForm()
  const [vehiclesGroup, setVehiclesGroup] = useState([
    {
      Id: null,
      content: { title: 'Veículo ', subtitle: 'Sem vínculo' },
      position: 1
    }
  ])
  const [vehicleSelected, setVehicleSelected] = useState({
    Id: null,
    content: { title: 'Veículo ', subtitle: 'Sem vínculo' },
    position: 1
  })
  const [proposalArray, setProposalArray] = useState<proposals.ProposalsArray>()
  const [proposalArrayLoading, setProposalArrayLoading] = useState(false)
  const [showAddVehicleButton, setShowAddVehicleButton] = useState(true)
  const [generateProposal, setGenerateProposal] = useState(false)

  function renderCreateVehicle() {
    if (proposalArrayLoading) {
      return <proposals.VehicleSkeleton />
    }
    if (generateProposal) {
      return <proposals.GenerateProposal />
    }
    if (
      proposalArray!.Combos.length > 0 ||
      proposalArray!.Planos.length > 0 ||
      proposalArray!.Produtos.length > 0 ||
      proposalArray!.Servicos.length > 0
    ) {
      const licensePlates = vehiclesGroup
        .filter((vehicle) => vehicle.content.subtitle !== 'Sem vínculo')
        .map((vehicle) => vehicle.content.subtitle)
      return (
        <proposals.ViewVehicle
          proposalData={proposalArray}
          proposalDataLoading={proposalArrayLoading}
          vehicle={vehicleSelected}
          refetchArraysData={refetchArraysData}
          proposalRefetch={proposalRefetch}
          licensePlates={licensePlates}
        />
      )
    }
    return vehiclesGroup.map((vehicleGroup, index) => {
      if (vehicleSelected?.position === vehicleGroup.position) {
        return (
          <Controller
            control={control}
            key={index}
            name={'Veiculo' + vehicleGroup.position}
            render={() => (
              <div className="col-span-5">
                <proposals.CreateVehicle
                  onChange={(e) => onSubmit(e)}
                  vehicleName={'Veiculo ' + vehicleGroup.position}
                  createLoading={
                    createProposalComboLoading ||
                    createProposalPlanLoading ||
                    createProposalProductLoading ||
                    createProposalServiceLoading ||
                    createProposalUpSellingLoading ||
                    proposalLoading
                  }
                />
              </div>
            )}
          />
        )
      }
    })
  }

  async function addClientToProposalSubmit() {
    await addClientToProposal({
      variables: {
        Cliente_Id: watch('Cliente_Id').key || null
      }
    }).then(() => {
      proposalRefetch()
      notification('Cliente vinculado com sucesso', 'success')
    })
  }

  async function acceptProposalSubmit() {
    await acceptProposal().then(() => {
      proposalRefetch()
      notification('Proposta aceita com sucesso', 'success')
    })
  }

  async function refuseProposalSubmit() {
    await refuseProposal().then(() => {
      proposalRefetch()
      notification('Proposta recusada com sucesso', 'success')
    })
  }

  async function onSubmit(event: {
    planos?: {
      Plano_Id: string
      PlanoPreco_Id: string
    }[]
    produtos?: {
      Produto_Id: string
      ProdutoPreco_Id: string
    }[]
    servicos?: {
      ServicosPreco_Id: string
      Servico_Id: string
    }[]
    combos?: {
      Combo_Id: string
      ComboPreco_Id: string
    }[]
    oportunidades: {
      OportunidadeProduto_Id: string | null
      OportunidadeServico_Id: string | null
    }[]
  }) {
    event.combos?.map((combo) => {
      createProposalCombo({
        variables: {
          Combo_Id: combo.Combo_Id,
          ComboPreco_Id: combo.ComboPreco_Id,
          Veiculo: vehicleSelected.position
        }
      })
    })

    event.servicos?.map((service) => {
      createProposalService({
        variables: {
          Servico_Id: service.Servico_Id,
          ServicosPreco_Id: service.ServicosPreco_Id,
          Proposta_Id: router.query.id,
          Veiculo: vehicleSelected.position
        }
      })
    })

    event.planos?.map((plan) => {
      createProposalPlan({
        variables: {
          Plano_Id: plan.Plano_Id,
          PlanoPreco_Id: plan.PlanoPreco_Id,
          Proposta_Id: router.query.id,
          Veiculo: vehicleSelected.position
        }
      })
    })

    event.produtos?.map((product) => {
      createProposalProduct({
        variables: {
          Produto_Id: product.Produto_Id,
          Proposta_Id: router.query.id,
          ProdutoPreco_Id: product.ProdutoPreco_Id,
          Veiculo: vehicleSelected.position
        }
      })
    })

    event.oportunidades.map((upSelling) => {
      createProposalUpSelling({
        variables: {
          OportunidadeProduto_Id: upSelling.OportunidadeProduto_Id,
          OportunidadeServico_Id: upSelling.OportunidadeServico_Id,
          Proposta_Id: router.query.id,
          Veiculo: vehicleSelected.position
        }
      })
    })

    setProposalArrayLoading(true)
    await getProposalArray(vehicleSelected.position).then((proposal) => {
      setProposalArray(proposal)
      setShowAddVehicleButton(true)
    })
    setProposalArrayLoading(false)
  }

  function addVehicle() {
    setVehiclesGroup((lastArray) => {
      setVehicleSelected({
        Id: null,
        content: { title: 'Veículo ', subtitle: 'Sem vínculo' },
        position: lastArray[lastArray.length - 1].position + 1
      })
      return [
        ...lastArray,
        {
          Id: null,
          content: { title: 'Veículo ', subtitle: 'Sem vínculo' },
          position: lastArray[lastArray.length - 1].position + 1
        }
      ]
    })
    setShowAddVehicleButton(false)
  }

  async function refetchArraysData(action = 'update') {
    setProposalArrayLoading(true)
    await getProposalArray(vehicleSelected.position).then((proposal) =>
      setProposalArray(proposal)
    )
    if (action === 'delete') {
      setVehiclesGroup(
        vehiclesGroup.filter(
          (vehicle) => vehicle.position !== vehicleSelected.position
        )
      )
      setVehicleSelected(vehiclesGroup[0])
    }
    setProposalArrayLoading(false)
  }

  useEffect(() => {
    refetchArraysData()
  }, [vehicleSelected, router.query.id])

  useEffect(() => {
    vehiclesGroup.map((item) => {
      if (item.position === vehicleSelected.position) {
        setVehicleSelected(item)
      }
    })
  }, [vehiclesGroup])

  useEffect(() => {
    if (proposalData) {
      const vehiclesArray: number[] = []
      const vehicles: (
        | {
            Id: string
            Placa?: string
            Apelido?: string
            NumeroDoChassi?: string
            Categoria: { Id: string; Nome: string }
          }
        | undefined
      )[] = []
      proposalData.Combos.map((combo) => {
        if (!vehiclesArray.includes(combo.Veiculo)) {
          vehiclesArray.push(combo.Veiculo)
          vehicles.push(combo.VeiculoRelacionamento)
        }
      })
      proposalData.Planos.map((plan) => {
        if (!vehiclesArray.includes(plan.Veiculo)) {
          vehiclesArray.push(plan.Veiculo)
          vehicles.push(plan.VeiculoRelacionamento)
        }
      })
      proposalData.Produtos.map((product) => {
        if (!vehiclesArray.includes(product.Veiculo)) {
          vehiclesArray.push(product.Veiculo)
          vehicles.push(product.VeiculoRelacionamento)
        }
      })
      proposalData.Servicos.map((service) => {
        if (!vehiclesArray.includes(service.Veiculo)) {
          vehiclesArray.push(service.Veiculo)
          vehicles.push(service.VeiculoRelacionamento)
        }
      })
      const vehicleGroup = vehiclesArray.map((position, index) => {
        return {
          Id: vehicles[index]?.Id || null,
          content: {
            title: 'Veículo ',
            subtitle:
              vehicles[index] !== null
                ? `${vehicles[index]?.Apelido} - ${
                    vehicles[index]?.Placa !== null
                      ? vehicles[index]?.Placa
                      : vehicles[index]?.NumeroDoChassi?.substring(0, 10)
                  }`
                : 'Sem vínculo'
          },
          position
        }
      })
      if (proposalData?.Cliente) {
        setValue('Cliente_Id', {
          key: proposalData.Cliente.Id,
          title: proposalData.Cliente.Pessoa.Nome
        })
      }
      setVehiclesGroup(
        vehicleGroup.sort((item1, item2) => item1.position - item2.position)
      )
    }
  }, [proposalData])

  return (
    <main className="col-span-12">
      <form>
        <common.Card>
          <div className="flex">
            <div className="flex-1">
              <common.GenericTitle
                title={`Itens da proposta`}
                subtitle="Selecione combos, planos, serviços e produtos"
                className="px-6"
              />
            </div>

            <div className="mx-6">
              {generateProposal ? (
                <buttons.CancelButton
                  onClick={() => setGenerateProposal(false)}
                  title="Cancelar"
                />
              ) : (
                <buttons.SecondaryButton
                  handler={() => setGenerateProposal(true)}
                  title="Gerar proposta"
                />
              )}
            </div>
          </div>

          <common.Separator />
          <form.FormLine grid={12} position={1}>
            <Controller
              control={control}
              name="Cliente_Id"
              render={({ field: { onChange, value } }) => (
                <div className="flex col-span-7 gap-2">
                  <div className="flex-1">
                    <form.Select
                      itens={
                        clientsData
                          ? clientsData.map((item) => {
                              return {
                                key: item.Id,
                                title: item.Pessoa?.Nome as string
                              }
                            })
                          : []
                      }
                      value={value}
                      onChange={onChange}
                      label="Cliente"
                      disabled={proposalData?.Situacao.Valor !== 'criado'}
                    />
                    <common.OpenModalLink
                      onClick={() =>
                        setSlidePanelState({ open: true, type: 'createClient' })
                      }
                    >
                      Cadastrar Cliente
                    </common.OpenModalLink>
                  </div>
                  <div className="flex items-center justify-center h-10">
                    <buttons.SecondaryButton
                      handler={addClientToProposalSubmit}
                      title={<icons.CheckIcon />}
                      type="button"
                      disabled={proposalData?.Situacao.Valor !== 'criado'}
                    />
                  </div>
                </div>
              )}
            />

            <div className="flex justify-end col-span-5 gap-4">
              <div className="flex h-10">
                <buttons.CancelButton
                  title={
                    proposalData?.Situacao.Valor === 'recusado'
                      ? 'Proposta recusada'
                      : 'Recusar proposta'
                  }
                  disabled={
                    proposalData?.Situacao.Valor !== 'criado' ||
                    proposalData.Cliente === null
                  }
                  onClick={() => refuseProposalSubmit()}
                  className="my-0"
                />
              </div>

              <div className="flex h-10">
                <buttons.PrimaryButton
                  title={
                    proposalData?.Situacao.Valor === 'aceito'
                      ? 'Proposta aceita'
                      : 'Aceitar proposta'
                  }
                  disabled={
                    proposalData?.Situacao.Valor !== 'criado' ||
                    proposalData.Cliente === null
                  }
                  onClick={() => acceptProposalSubmit()}
                  type="button"
                  className="my-0"
                />
              </div>
            </div>
          </form.FormLine>
        </common.Card>

        <div className="grid grid-cols-6 mt-4">
          {!generateProposal && (
            <blocks.SideBarTabs
              array={vehiclesGroup}
              setArray={setVehiclesGroup}
              onChange={setVehicleSelected}
              allowAdding={
                showAddVehicleButton &&
                proposalData?.Situacao.Valor === 'criado'
              }
              addFunction={addVehicle}
              selectedItem={vehicleSelected}
              loading={proposalData === undefined}
            />
          )}

          <div className={`${generateProposal ? 'col-span-6' : 'col-span-5'} `}>
            {proposalArray ? (
              renderCreateVehicle()
            ) : (
              <proposals.VehicleSkeleton />
            )}
          </div>
        </div>
      </form>
      <proposals.SlidePanel />
    </main>
  )
}

export default ProposalDetails
