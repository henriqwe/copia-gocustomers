import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as inputKits from '@/domains/erp/production/Kits/InputKits'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

const GiveBackInputKit = () => {
  const router = useRouter()
  const {
    giveBackInputType,
    giveBackInputTypeLoading,
    inputKitData,
    giveBackInputTypeItem,
    giveBackInputTypeItemLoading
  } = inputKits.useGiveBack()
  const { control, handleSubmit, register } = useForm()

  async function onSubmit(data: any) {
    try {
      let itensValues = inputKitData!.Itens.map((item, index) => {
        if (!data['QuantidadeDevolver' + index]) {
          return
        }

        if (
          data['QuantidadeDevolver' + index] > data['QuantidadeAtual' + index]
        ) {
          return null
        }

        return {
          Data: new Date(),
          Item_Id: data['Item_Id' + index].key,
          Valor: 0,
          Quantidade: data['QuantidadeDevolver' + index],
          Tipo: 'entrada',
          Motivo_Id: 'devolucaoDeKitDeInsumo',
          Id: item.Id,
          QuantidadeAtual: data['QuantidadeAtual' + index]
        }
      })

      if (itensValues.includes(null)) {
        throw new Error(
          'A quantidade para devolver precisa ser menor que a quantidade atual!'
        )
      }

      itensValues = itensValues.filter((item) => item?.Quantidade !== undefined)

      const finalItensValues = itensValues.map((item) => {
        giveBackInputTypeItem({
          variables: {
            Id: item?.Id,
            Quantidade: item?.QuantidadeAtual - item?.Quantidade
          }
        })

        return {
          Data: item?.Data,
          Item_Id: item?.Item_Id,
          Valor: item?.Valor,
          Quantidade: item?.Quantidade,
          Tipo: item?.Tipo,
          Motivo_Id: item?.Motivo_Id
        }
      })

      await giveBackInputType({
        variables: {
          data: finalItensValues
        }
      }).then(async () => {
        router.push(rotas.erp.producao.kits.kitsDeInsumo.index)
        notification('Insumos devolvidos com sucesso', 'success')
      })
    } catch (err: any) {
      showError(err)
    }
  }

  return (
    <common.Card>
      <form>
        <common.GenericTitle
          title="Dados do kit"
          subtitle="Itens e Quantidade para devolver"
          className="px-6"
        />
        <common.Separator />

        {inputKitData?.Itens.map((item, index) => (
          <form.FormLine position={index} grid={5} key={index}>
            <Controller
              name={'Item_Id' + index}
              defaultValue={{
                key: item.Item.Id,
                titulo:
                  item.Item.Produto.Nome +
                  ' - ' +
                  item.Item.Fabricante.Nome +
                  ' - ' +
                  item.Item.Modelo?.Nome +
                  ' - ' +
                  item.Item.Grupo.Nome +
                  ' - ' +
                  item.Item.Familia.Nome
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
              name={'QuantidadeAtual' + index}
              defaultValue={item.Quantidade}
              control={control}
              render={({ field: { value } }) => (
                <div>
                  <form.Input
                    fieldName={'QuantidadeAtual' + index}
                    value={value}
                    onChange={() => null}
                    title="Quantidade atual"
                    register={register}
                    disabled
                  />
                </div>
              )}
            />

            <div>
              <form.Input
                fieldName={'QuantidadeDevolver' + index}
                title="Quantidade para devolver"
                register={register}
              />
            </div>
          </form.FormLine>
        ))}
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Devolver"
          disabled={giveBackInputTypeLoading || giveBackInputTypeItemLoading}
          onClick={handleSubmit(onSubmit)}
          loading={giveBackInputTypeLoading || giveBackInputTypeItemLoading}
        />
      </div>
    </common.Card>
  )
}

export default GiveBackInputKit
