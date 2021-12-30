import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as kitsTypes from '@/domains/erp/production/Kits/InputKits/KitsTypes'
import * as inputKits from '@/domains/erp/production/Kits/InputKits'
import { useState, useEffect } from 'react'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type KitItens = {
  Id: string
  Quantidade: number
  Item: itens
}

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
  Movimentacoes: {
    Tipo: string
    Quantidade: number
  }[]
  Grupo: {
    Nome: string
  }
  Familia: { Nome: string }
}

const CreateInputKit = () => {
  const [kitItens, setKitItens] = useState<KitItens[]>([])
  const [itensPerFamily, setItensPerFamily] = useState<itens[]>([])
  const [itensGroup, setItensGroup] = useState<number[]>([])
  const [lastNumber, setLastNumber] = useState(0)
  const router = useRouter()
  const {
    createInputKit,
    createInputKitLoading,
    configData,
    getItensPerFamily
  } = inputKits.useCreate()
  const { kitsTypesData } = kitsTypes.useList()
  const { control, handleSubmit, register, watch } = useForm()

  async function onSubmit(data: any) {
    try {
      const itensValues = itensGroup.map((item, index) => {
        if (!data['lote' + item]) {
          return
        }

        return {
          Lote: data['lote' + item],
          Quantidade: kitItens[index].Quantidade,
          Item_Id: data['Item_Id' + item].key
        }
      })

      if (itensValues.includes(undefined)) {
        throw new Error('Preencha todos os campos para continuar')
      }

      const moveValues = itensValues.map((item) => {
        return {
          Data: new Date(),
          Item_Id: item?.Item_Id,
          Valor: 0,
          Quantidade: item?.Quantidade,
          Tipo: 'saida',
          Motivo_Id: 'criacaoDeKitDeInsumo'
        }
      })
      moveValues.push({
        Data: new Date(),
        Item_Id: data['Item_Id'].key,
        Valor: 0,
        Quantidade: 1,
        Tipo: 'entrada',
        Motivo_Id: 'criacaoDeKitDeInsumo'
      })

      await createInputKit({
        variables: {
          Item_Id: data['Item_Id'].key,
          Tipo_Id: data['Tipo_Id'].key.Id,
          data: itensValues,
          dataMovimentacao: moveValues
        }
      }).then(async () => {
        router.push(rotas.erp.producao.kits.kitsDeInsumo.index)
        notification('Kit de insumo criado com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  function disableMainButton() {
    const itensArray: any[] = []
    itensGroup.map((item, index) => {
      if (kitItens[index].Quantidade > watch('saldo' + item)) {
        itensArray.push(null)
      }
      itensArray.push(watch('saldo' + item))
    })
    if (
      itensArray.includes(0) ||
      itensArray.includes(undefined) ||
      itensArray.includes(null)
    ) {
      return true
    }
    return watch('Item_Id') === undefined || createInputKitLoading
  }

  function initialGrid() {
    if (kitsTypesData?.length === 0 || !configData?.Valor[0]) {
      return 1
    }

    return 3
  }

  function calculateBalance(array: any[] = []) {
    let balance = 0
    array.map((movimentacao) => {
      if (movimentacao.Tipo === 'saida') {
        balance = balance - movimentacao.Quantidade
        return
      }
      balance = balance + movimentacao.Quantidade
    })
    if (balance < 0) {
      balance = 0
    }
    return balance
  }

  useEffect(() => {
    getItensPerFamily().then((itens) => {
      setItensPerFamily(itens)
    })
  }, [getItensPerFamily])

  useEffect(() => {
    const array: number[] = []
    kitItens.map((item, index) => {
      array.push(lastNumber + index + 1)
    })
    setItensGroup([...itensGroup, ...array])
  }, [kitItens])

  useEffect(() => {
    if (itensGroup[itensGroup.length - 1] > lastNumber) {
      setLastNumber(itensGroup[itensGroup.length - 1])
    }
  }, [itensGroup, lastNumber])

  return (
    <common.Card>
      <form>
        <common.GenericTitle
          title="Dados do principais"
          subtitle="Item e tipos"
          className="px-6"
        />
        <common.Separator />
        <form.FormLine grid={initialGrid()} position={1}>
          {!configData?.Valor[0] ? (
            <common.ConfigMessage>
              Selecione a família de itens para kits de insumo em configurações
              primeiro
            </common.ConfigMessage>
          ) : kitsTypesData?.length === 0 ? (
            <div className="flex items-center justify-center my-8">
              <p className="text-xl">Sem tipos de kits de insumo cadastrados</p>
            </div>
          ) : (
            <>
              <Controller
                control={control}
                name="Tipo_Id"
                render={({ field: { onChange, value } }) => (
                  <div>
                    <form.Select
                      itens={
                        kitsTypesData
                          ? kitsTypesData.map((item) => {
                              return {
                                key: item,
                                title: item.Nome
                              }
                            })
                          : []
                      }
                      value={value}
                      onChange={(e) => {
                        setItensGroup([])
                        setKitItens(e.key.Itens)
                        onChange(e)
                      }}
                      label="Selecione o tipo"
                    />
                    <common.OpenModalLink onClick={() => null}>
                      * Itens pré-definidos
                    </common.OpenModalLink>
                  </div>
                )}
              />

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
                      disabled={watch('Tipo_Id') === undefined}
                      label="Item"
                    />
                    <common.OpenModalLink onClick={() => null}>
                      * Item a ser movimentado
                    </common.OpenModalLink>
                  </div>
                )}
              />
            </>
          )}
        </form.FormLine>
        {kitsTypesData?.length === 0 ? (
          <div />
        ) : (
          <>
            {kitItens.length !== 0 && (
              <div className="mt-2">
                <common.GenericTitle
                  title="Dados dos itens"
                  subtitle="Identificação e Lote"
                  className="px-6"
                />
                <common.Separator />
              </div>
            )}
            {itensGroup.map((item, index) => (
              <form.FormLine position={index} grid={6} key={index}>
                <Controller
                  name={'Item_Id' + item}
                  defaultValue={{
                    key: kitItens[index].Item.Id,
                    title:
                      kitItens[index].Item.Produto.Nome +
                      ' - ' +
                      kitItens[index].Item.Fabricante.Nome +
                      ' - ' +
                      kitItens[index].Item.Modelo?.Nome +
                      ' - ' +
                      kitItens[index].Item.Grupo.Nome +
                      ' - ' +
                      kitItens[index].Item.Familia.Nome
                  }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-3">
                      <form.Select
                        itens={[]}
                        value={value}
                        onChange={onChange}
                        disabled
                        label="Item"
                      />
                    </div>
                  )}
                />

                <Controller
                  name={'saldo' + item}
                  defaultValue={calculateBalance(
                    kitItens[index].Item.Movimentacoes
                  )}
                  control={control}
                  render={({ field: { value } }) => (
                    <div>
                      <form.Input
                        fieldName={'saldo' + index}
                        value={value}
                        onChange={() => null}
                        title="Saldo"
                        register={register}
                        disabled
                      />
                    </div>
                  )}
                />

                <Controller
                  name={'quantidade' + item}
                  defaultValue={kitItens[index].Quantidade}
                  control={control}
                  render={({ field: { value } }) => (
                    <div>
                      <form.Input
                        fieldName={'quantidade' + item}
                        title="Quantidade"
                        register={register}
                        value={value}
                        onChange={() => null}
                        disabled
                      />
                    </div>
                  )}
                />

                <div>
                  <form.Input
                    fieldName={'lote' + item}
                    title="Lote"
                    register={register}
                  />
                </div>
              </form.FormLine>
            ))}
          </>
        )}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Cadastrar"
          disabled={disableMainButton()}
          onClick={handleSubmit(onSubmit)}
          loading={createInputKitLoading}
        />
      </div>
    </common.Card>
  )
}

export default CreateInputKit
