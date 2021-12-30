import InputMask, { BeforeMaskedStateChangeStates } from 'react-input-mask'
import { Control, Controller } from 'react-hook-form'
import * as form from '@/common/Form'
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { ReactNode } from 'react'

type LicensePlateInputProps = {
  control: Control<FieldValues>
  register: UseFormRegister<FieldValues>
  error?: DeepMap<FieldValues, FieldError>
  className?: string
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
} & React.InputHTMLAttributes<HTMLInputElement>

function LicensePlateInput({
  control,
  error,
  disabled = false,
  onChange = () => null,
  ...rest
}: LicensePlateInputProps) {
  function beforeMaskedStateChange({
    nextState
  }: BeforeMaskedStateChangeStates) {
    nextState.value = nextState.value.toUpperCase()
    return nextState
  }

  return (
    <Controller
      name="Placa"
      control={control}
      render={({ field: { onChange: controllerOnChange } }) => (
        <InputMask
          mask={'aaa-9*99'}
          placeholder="000.0000"
          onChange={(e) => {
            onChange(e)
            controllerOnChange(e)
          }}
          disabled={disabled}
          beforeMaskedStateChange={beforeMaskedStateChange}
        >
          <form.Input
            fieldName="Placa"
            title="Placa"
            // onChange={(e) => {
            //   if (e.target.value.length < 8) {
            //     onChange(e.target.value.toLocaleUpperCase())
            //   }
            // }}
            error={error}
            {...rest}
          />
        </InputMask>
      )}
    />
  )
}

export default LicensePlateInput
