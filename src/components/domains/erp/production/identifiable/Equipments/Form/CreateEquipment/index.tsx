import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as equipments from '@/domains/erp/production/identifiable/Equipments'
import { useState, useEffect } from 'react'
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

const Formulario = () => {
  const [lastNumber, setLastNumber] = useState(0)
  const [equipmentsGroup, setEquipmentsGroup] = useState<number[]>([1])
  const [itensPerFamily, setItensPerFamily] = useState<itens[]>([])
  const [amount, setAmount] = useState<number>()
  const [reload, setReload] = useState(false)
  const router = useRouter()
  const {
    createEquipmentLoading,
    createEquipment,
    getItemAmount,
    getItensByFamily,
    configData
  } = equipments.useCreate()
  const { control, handleSubmit, watch, setValue } = useForm()

  async function onSubmit(data: any) {
    try {
      const filteredEquipmentsGroup = equipmentsGroup.filter(
        (equipment) => equipment !== 0
      )
      const equipmentsValues = filteredEquipmentsGroup.map((equipamentos) => {
        if (!data['Identificador' + equipamentos]) {
          return
        }

        if (data['Imei' + equipamentos].length < 15) {
          return null
        }

        return {
          Identificador: Number(
            data['Imei' + equipamentos].toString().slice(5, 14)
          ),
          Imei: data['Imei' + equipamentos],
          Item_Id: data.Item_Id.key.Id
        }
      })

      if (equipmentsValues.includes(undefined)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      if (equipmentsValues.includes(null)) {
        throw new Error('Campos do Número do dispositivo devem ter 15 dígitos')
      }

      await createEquipment({
        variables: {
          data: equipmentsValues,
          Item_Id: data.Item_Id.key.Id,
          Quantidade: equipmentsValues.length
        }
      }).then(() => {
        router.push(rotas.erp.producao.identificaveis.equipamentos.index)
        const frase =
          equipmentsValues.length > 1
            ? 'Equipamentos criados com sucesso'
            : 'Equipamento criado com sucesso'
        notification(frase, 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  useEffect(() => {
    if (watch('Item_Id') !== undefined) {
      getItemAmount(watch('Item_Id').key.Id).then((quantidadeDisponivel) => {
        if (quantidadeDisponivel <= 0) {
          setAmount(0)
          setEquipmentsGroup([1])
          return
        }
        setAmount(quantidadeDisponivel)
      })
    }
  }, [getItemAmount, watch('Item_Id')])

  function disableMainButton() {
    return (
      watch('Item_Id') === undefined || createEquipmentLoading || amount === 0
    )
  }

  useEffect(() => {
    if (equipmentsGroup[equipmentsGroup.length - 1] > lastNumber) {
      setLastNumber(equipmentsGroup[equipmentsGroup.length - 1])
    }
  }, [equipmentsGroup, lastNumber])

  useEffect(() => {
    getItensByFamily().then((itens) => {
      setItensPerFamily(itens)
    })
  }, [getItensByFamily])

  return (
    <common.Card>
      <common.GenericTitle
        title="Item pertencente"
        subtitle="Selecione o item que os chips pertencem"
        className="px-6"
      />

      <common.Separator />
      <form>
        <form.FormLine position={1} grid={!configData?.Valor[0] ? 1 : 3}>
          {!configData?.Valor[0] ? (
            <common.ConfigMessage>
              Selecione a família de itens para equipamentos em configurações
              primeiro
            </common.ConfigMessage>
          ) : (
            <Controller
              name="Item_Id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-2">
                  <form.Select
                    itens={
                      itensPerFamily
                        ? itensPerFamily.map((item) => {
                            return {
                              key: item,
                              title:
                                item.Produto.Nome +
                                ' ' +
                                item.Fabricante.Nome +
                                ' ' +
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
                    onChange={(e) => {
                      onChange(e)
                    }}
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
          {amount ? (
            <>
              <p className="m-auto text-center text-md">
                Saldo do item no estoque: {amount}
              </p>
            </>
          ) : (
            ''
          )}
        </form.FormLine>
        <common.Separator />
        {amount === undefined ? (
          <div />
        ) : amount === 0 ? (
          <div className="flex items-center justify-center my-8">
            <p className="text-xl">Sem equipamentos no estoque</p>
          </div>
        ) : (
          <>
            <common.GenericTitle
              title="Dados dos equipamentos"
              subtitle="Número do dispositivo, Imei e Firmware"
              className="px-6"
            />
            <common.Separator />
            {equipmentsGroup.map(
              (equipamento, index) =>
                equipamento !== 0 && (
                  <form.FormLine position={index + 1} grid={7} key={index}>
                    <Controller
                      name={'Imei' + equipamento}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="col-span-2">
                          <form.Input
                            fieldName={'Imei' + equipamento}
                            onChange={(e) => {
                              if (e.target.value.length > 5) {
                                const identificador = e.target.value
                                  .trim()
                                  .slice(5, 14)
                                setValue(
                                  'Identificador' + equipamento,
                                  identificador
                                )
                              } else {
                                setValue('Identificador' + equipamento, null)
                              }

                              if (e.target.value.length < 16) {
                                onChange(e.target.value.trim())
                              }
                            }}
                            value={value}
                            title="Imei"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name={'Identificador' + equipamento}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="col-span-2">
                          <form.Input
                            fieldName={'Identificador' + equipamento}
                            onChange={(e) => {
                              if (e.target.value.length < 10) {
                                onChange(e.target.value.trim())
                              }
                            }}
                            value={value}
                            title="Identificador"
                            disabled
                          />
                        </div>
                      )}
                    />

                    {equipamento !== 1 && (
                      <buttons.DeleteButton
                        onClick={() => {
                          equipmentsGroup[index] = 0
                          setReload(!reload)
                        }}
                      />
                    )}
                  </form.FormLine>
                )
            )}

            {!createEquipmentLoading && equipmentsGroup.length < amount && (
              <common.AddForm
                array={equipmentsGroup}
                setArray={setEquipmentsGroup}
                lastNumber={lastNumber}
              >
                Adicionar outro equipamento
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
          loading={createEquipmentLoading}
        />
      </div>
    </common.Card>
  )
}

export default Formulario
