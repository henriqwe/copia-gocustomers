import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as trackers from '@/domains/erp/production/Trackers'
import { useEffect, useState } from 'react'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type itens = {
  Id: string
  Produto: {
    Id: string
    Nome: string
  }
  Fabricante: {
    Id: string
    Nome: string
  }
  Modelo?: {
    Id: string
    Nome: string
  }
  Grupo: {
    Nome: string
  }
  Familia: { Nome: string }
}

type Chips = {
  Id: string
  Operadora: {
    Nome: string
  }
  Item?: {
    Id: string
  }
  Iccid: string
}

type Equipamentos = {
  Id: string
  Imei: string
  Item: {
    Id: string
    Produto: {
      Id: string
      Nome: string
    }
  }
}

const CreateTrackers = () => {
  const [lastNumber, setLastNumber] = useState(0)
  const [trackersGroup, setTrackersGroup] = useState<number[]>([1])
  const [itensPerFamily, setItensPerFamily] = useState<itens[]>([])
  const [chipsData, setChipsData] = useState<Chips[]>([])
  const [equipmentsData, setEquipmentsData] = useState<Equipamentos[]>([])
  const [reload, setReload] = useState(false)
  const router = useRouter()
  const {
    createTracker,
    createTrackerLoading,
    moveStock,
    getFilteredEquipments,
    configData,
    getItensPerFamily,
    getFilteredChips
  } = trackers.useCreate()
  const { control, handleSubmit, watch } = useForm()

  async function onSubmit(data: any) {
    try {
      const filteredTrackersGroup = trackersGroup.filter((item) => item !== 0)
      const chipsValues = filteredTrackersGroup.map((chip) => {
        if (!data['Chip_Id' + chip] || !data['Equipamento_Id' + chip]) {
          return
        }

        return {
          Chip_Id: data['Chip_Id' + chip].key.Id,
          Equipamento_Id: data['Equipamento_Id' + chip].key.Id,
          Item_Id: data['Item_Id'].key
        }
      })

      if (chipsValues.includes(undefined)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      await createTracker({
        variables: {
          data: chipsValues
        }
      }).then(async () => {
        filteredTrackersGroup.map(async (rastreador) => {
          await moveStock({
            variables: {
              Item_Id: data['Item_Id'].key,
              ItemChip_Id: data['Chip_Id' + rastreador].key.Item?.Id,
              Chip_Id: data['Chip_Id' + rastreador].key.Id,
              ItemEquipamento_Id:
                data['Equipamento_Id' + rastreador].key.Item.Id
            }
          })
        })
        router.push(rotas.erp.producao.rastreadores.index)
        notification('Rastreador criado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  function disableMainButton() {
    return watch('Item_Id') === undefined || createTrackerLoading
  }

  function initialGrid() {
    if (chipsData?.length === 0 || equipmentsData.length === 0) {
      return 1
    }

    if (configData?.Valor[0]) {
      return 2
    }
  }

  useEffect(() => {
    getItensPerFamily().then((itens) => {
      setItensPerFamily(itens)
    })
    getFilteredEquipments().then((equipamentos) => {
      setEquipmentsData(equipamentos)
    })
    getFilteredChips().then((chips) => {
      setChipsData(chips)
    })
  }, [getFilteredChips, getFilteredEquipments, getItensPerFamily])

  useEffect(() => {
    if (trackersGroup[trackersGroup.length - 1] > lastNumber) {
      setLastNumber(trackersGroup[trackersGroup.length - 1])
    }
  }, [trackersGroup, lastNumber])

  return (
    <common.Card>
      <common.GenericTitle
        title="Item pertencente"
        subtitle="Selecione o item que os rastreadores pertencem"
        className="px-6"
      />
      <common.Separator />
      <form>
        <form.FormLine position={1} grid={initialGrid()}>
          {!configData?.Valor[0] ? (
            <common.ConfigMessage>
              Selecione a família de itens para rastreadores em configurações
              primeiro
            </common.ConfigMessage>
          ) : chipsData?.length === 0 || equipmentsData.length === 0 ? (
            <div className="flex items-center justify-center my-8">
              <p className="text-xl">
                Sem{' '}
                {chipsData?.length === 0
                  ? 'chips inativos'
                  : 'equipamentos sem vinculo'}{' '}
                no estoque
              </p>
            </div>
          ) : (
            <Controller
              name="Item_Id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <form.Select
                    itens={
                      itensPerFamily
                        ? itensPerFamily.map((item) => {
                            return {
                              key: item.Id,
                              title:
                                item.Produto.Nome +
                                ' - ' +
                                item.Fabricante.Nome +
                                ' - ' +
                                item.Modelo?.Nome +
                                ' - ' +
                                item.Grupo.Nome +
                                ' - ' +
                                item.Familia.Nome
                            }
                          })
                        : []
                    }
                    value={value}
                    onChange={onChange}
                    label="Item"
                  />
                  <common.OpenModalLink
                    onClick={() => router.push(rotas.erp.estoque.index)}
                  >
                    Cadastrar item
                  </common.OpenModalLink>
                </div>
              )}
            />
          )}
        </form.FormLine>
        {chipsData?.length === 0 || equipmentsData.length === 0 ? (
          <div />
        ) : watch('Item_Id') === undefined ? (
          <div />
        ) : (
          <>
            <div className="mt-4">
              <common.GenericTitle
                title="Dados dos rastreadores"
                subtitle="Chips e Equipamentos"
                className="px-6"
              />
            </div>
            <common.Separator />
            {trackersGroup.map(
              (chip, index) =>
                chip !== 0 && (
                  <form.FormLine position={chip} grid={7} key={index}>
                    <Controller
                      name={'Chip_Id' + chip}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="col-span-2">
                          <form.Select
                            itens={
                              chipsData
                                ? chipsData.map((chip) => {
                                    return {
                                      key: chip,
                                      title:
                                        chip.Operadora.Nome + ' - ' + chip.Iccid
                                    }
                                  })
                                : []
                            }
                            value={value}
                            onChange={onChange}
                            label="Chip"
                          />
                          <common.OpenModalLink
                            onClick={() =>
                              router.push(
                                rotas.erp.producao.identificaveis.chips
                                  .cadastrar
                              )
                            }
                          >
                            Cadastrar chip
                          </common.OpenModalLink>
                        </div>
                      )}
                    />

                    <Controller
                      name={'Equipamento_Id' + chip}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="col-span-2">
                          <form.Select
                            itens={
                              equipmentsData
                                ? equipmentsData.map((equipamento) => {
                                    return {
                                      key: equipamento,
                                      title: equipamento.Imei.toString()
                                    }
                                  })
                                : []
                            }
                            value={value}
                            onChange={onChange}
                            label="Equipamento"
                          />
                          <common.OpenModalLink
                            onClick={() =>
                              router.push(
                                rotas.erp.producao.identificaveis.equipamentos
                                  .cadastrar
                              )
                            }
                          >
                            Cadastrar equipamento
                          </common.OpenModalLink>
                        </div>
                      )}
                    />

                    {chip !== 1 && (
                      <buttons.DeleteButton
                        onClick={() => {
                          trackersGroup[index] = 0
                          setReload(!reload)
                        }}
                      />
                    )}
                  </form.FormLine>
                )
            )}

            {configData?.Valor[0] && !createTrackerLoading && (
              <common.AddForm
                array={trackersGroup}
                setArray={setTrackersGroup}
                lastNumber={lastNumber}
              >
                Adicionar outro rastreador
              </common.AddForm>
            )}
          </>
        )}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Cadastrar"
          disabled={disableMainButton()}
          onClick={handleSubmit(onSubmit)}
          loading={createTrackerLoading}
        />
      </div>
    </common.Card>
  )
}

export default CreateTrackers
