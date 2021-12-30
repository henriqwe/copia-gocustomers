import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GraphQLTypes } from 'graphql/generated/zeus'

import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as sellers from '@/domains/erp/identities/Providers/Tabs/Sellers'
import { notification } from 'utils/notification'

export default function CreateSeller() {
  const {
    setSlidePanelState,
    sellerSchema,
    createSeller,
    createSellerLoading,
    sellersRefetch
  } = sellers.useSeller()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(sellerSchema)
  })
  const onSubmit = (formData: GraphQLTypes['identidades_Vendedores']) => {
    createSeller({
      variables: {
        Nome: formData.Nome
      }
    })
      .then(() => {
        sellersRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Nome + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        notification(err.message, 'error')
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="inserirForm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex-1">
          <form.Input
            fieldName="Nome"
            register={register}
            title="Nome"
            error={errors.Nome}
            data-testid="inserirNome"
          />
        </div>
        <buttons.PrimaryButton
          title="Salvar"
          disabled={createSellerLoading}
          loading={createSellerLoading}
          className="mb-3"
        />
      </div>
    </form>
  )
}
