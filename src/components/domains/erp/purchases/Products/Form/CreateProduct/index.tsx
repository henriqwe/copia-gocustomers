import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import rotas from '@/domains/routes'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as products from '@/domains/erp/purchases/Products'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'

type FormData = {
  Nome: string
  Descricao: string
  Utilizacao: string
  UnidadeMedida: { key: string; titulo: string }
  NCM: number
}

const Cadastrar = () => {
  const router = useRouter()
  const {
    productSchema,
    createProductLoading,
    createProduct,
    unitsOfMeasureData
  } = products.useCreate()
  const {
    register,
    formState: { errors },
    control,
    handleSubmit
  } = useForm({ resolver: yupResolver(productSchema) })

  async function onSubmit(data: FormData) {
    await createProduct({
      variables: {
        Nome: data.Nome,
        NCM: data.NCM,
        // Descricao: data.Descricao,
        Utilizacao: data.Utilizacao,
        UnidadeDeMedida_Id: data.UnidadeMedida.key
      }
    })
      .then(() => {
        router.push(rotas.erp.compras.produtos.index)
        notification(data.Nome + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        showError(err)
      })
  }

  return (
    <common.Card>
      <common.GenericTitle
        title="Identificação do produto"
        subtitle="Nome, descrição e utilização"
        className="px-6"
      />

      <common.Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <form.FormLine position={1} grid={3}>
          <form.Input
            fieldName="Nome"
            title="Nome"
            register={register}
            error={errors.Nome}
          />

          {/* <div className="col-span-2">
            <common.Input
              nomeDoCampo="Descricao"
              titulo="Descrição"
              register={register}
              error={errors.Descricao}
            />
          </div> */}
          <div className="col-span-2">
            <form.Input
              fieldName="Utilizacao"
              title="Utilização"
              register={register}
              error={errors.Utilizacao}
            />
          </div>
        </form.FormLine>
        {/* <common.LinhaDeFormulario posicao={2} grid={7}>

        </common.LinhaDeFormulario> */}

        <div className="mt-4">
          <common.GenericTitle
            title="Outros dados"
            subtitle="Unidade de medida"
            className="px-6"
          />

          <common.Separator />
        </div>
        <form.FormLine position={1} grid={2}>
          <Controller
            control={control}
            name="UnidadeMedida"
            render={({ field: { onChange, value } }) => (
              <div>
                <form.Select
                  itens={
                    unitsOfMeasureData
                      ? unitsOfMeasureData.UnidadesDeMedidas.map((item) => {
                          return { key: item.Valor, title: item.Comentario }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  error={errors.UnidadeMedida}
                  label="Unidade de medida"
                />
              </div>
            )}
          />

          <form.Input
            fieldName="NCM"
            title="NCM"
            register={register}
            error={errors.NCM}
            type="number"
          />
        </form.FormLine>
        <div className="flex items-center justify-between w-full px-6 mt-4">
          <buttons.GoBackButton />
          <buttons.PrimaryButton
            title="Cadastrar"
            disabled={createProductLoading}
            loading={createProductLoading}
          />
        </div>
      </form>
    </common.Card>
  )
}

export default Cadastrar
