import InputMask from 'react-input-mask'
import { Control, Controller } from 'react-hook-form'
import * as form from '@/common/Form'
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { ReactNode } from 'react'

type BRPhoneInputProps = {
  control: Control<FieldValues>
  register?: UseFormRegister<FieldValues>
  error?: DeepMap<FieldValues, FieldError>
  disabled?: boolean
  index?: number
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
} & React.InputHTMLAttributes<HTMLInputElement>

function BRPhoneInput({
  control,
  index,
  error,
  register,
  disabled = false,
  ...rest
}: BRPhoneInputProps) {
  return (
    <Controller
      name={index ? 'Telefone' + index : 'Telefone'}
      control={control}
      render={({ field: { onChange } }) => (
        <InputMask
          mask="(99) 99999-9999"
          placeholder="(00) 00000-0000"
          onChange={onChange}
          disabled={disabled}
        >
          <form.Input
            fieldName="Telefone"
            title="Telefone"
            error={error}
            register={register}
            {...rest}
          />
        </InputMask>
      )}
    />
  )
}

export default BRPhoneInput
