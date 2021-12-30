import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import * as form from '@/common/Form'
import * as buttons from '@/common/Buttons'
import * as sellers from '@/domains/erp/identities/Providers/Tabs/Sellers'
import { phoneUnformat } from 'utils/formaters'
import { notification } from 'utils/notification'

export default function Phones() {
  const {
    phoneSchema,
    updateSellerPhones,
    updateSellerPhonesLoading,
    sellersRefetch,
    slidePanelState,
    setSlidePanelState
  } = sellers.useSeller()
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    register
  } = useForm({
    resolver: yupResolver(phoneSchema)
  })

  const onSubmit = (formData: { Telefone: string }) => {
    formData.Telefone = phoneUnformat(formData.Telefone)
    updateSellerPhones({
      variables: {
        Id: slidePanelState.data?.Id,
        Telefones: [...slidePanelState.data?.Telefones, formData.Telefone]
      }
    })
      .then(() => {
        setSlidePanelState((oldState) => {
          return {
            ...oldState,
            data: {
              ...oldState.data,
              Telefones: [...oldState.data?.Telefones, formData.Telefone]
            }
          }
        })
        sellersRefetch()
        reset({
          Telefone: ''
        })
        notification(formData.Telefone + ' cadastrado com sucesso', 'success')
      })
      .catch((err) => {
        notification(err.message, 'error')
      })
  }

  return (
    <form
      data-testid="inserirForm"
      className="flex items-center justify-between gap-2 mb-2"
    >
      <div className="flex-1">
        <form.BRPhoneInput
          control={control}
          error={errors.Telefone}
          register={register}
        />
      </div>
      <buttons.SecondaryButton
        handler={handleSubmit(onSubmit)}
        loading={updateSellerPhonesLoading}
        disabled={updateSellerPhonesLoading}
        className="w-8 h-full"
      />
    </form>
  )
}
