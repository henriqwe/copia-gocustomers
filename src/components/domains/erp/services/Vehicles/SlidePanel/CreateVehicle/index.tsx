import { Controller, useForm } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as icons from '@/common/Icons'
import * as vehicles from '@/domains/erp/services/Vehicles'
import * as clients from '@/domains/erp/identities/Clients'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useRouter } from 'next/router'
import rotas from '@/domains/routes'
import axios from 'axios'
import { useEffect, useState } from 'react'

type FormData = {
  Id: string
  Placa: string
  Categoria_Id: {
    key: string
    title: string
  }
  Cliente_Id: {
    key: string
    title: string
  }
  Apelido: string
  Chassi: string
}

export default function CreateVehicle() {
  const router = useRouter()
  const [apiData, setApiData] = useState([])
  const [loading, setLoading] = useState(false)
  const {
    createVehicleLoading,
    createVehicle,
    setSlidePanelState,
    vehiclesTypeData,
    vehiclesRefetch,
    vehicleSchema,
    getVehicleCategoryByName,
    vehicleCategory,
    setVehicleCategory
  } = vehicles.useVehicle()
  const { clientsData } = clients.useList()
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(vehicleSchema)
  })
  const onSubmit = async (formData: FormData) => {
    const categoryId = await getVehicleCategoryByName(formData.Categoria_Id.key)
    createVehicle({
      variables: {
        Placa: vehicleCategory === 'placa' ? formData.Placa : null,
        Categoria_Id:
          categoryId.length > 0
            ? categoryId[0].Id
            : '3f5d1306-5201-4a7e-ae95-85fe1a22d894',
        Cliente_Id: formData.Cliente_Id ? formData.Cliente_Id.key : null,
        DadosDaApi: apiData,
        Apelido: formData.Apelido,
        NumeroDoChassi: vehicleCategory === 'chassi' ? formData.Chassi : null
      }
    })
      .then(() => {
        vehiclesRefetch()
        setSlidePanelState((oldState) => {
          return { ...oldState, open: false }
        })
        notification(formData.Apelido + ' cadastrado com sucesso', 'success')
      })
      .catch((error) => showError(error))
  }

  function disableSearchButton() {
    if (loading) {
      return true
    }
    if (watch('Placa')) {
      if (watch('Placa')[7] !== '_') {
        return false
      }
      return true
    }
    return true
  }

  useEffect(() => {
    setValue('Categoria_Id', undefined)
  }, [vehicleCategory])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="inserirForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <common.ListRadioGroup
          options={[
            {
              value: 'placa',
              content: (
                <div className="inline-flex items-center gap-4">
                  <p className="text-sm">Placa</p>
                </div>
              )
            },
            {
              value: 'chassi',
              content: (
                <div className="inline-flex items-center gap-4">
                  <p className="text-sm">Chassi</p>
                </div>
              )
            }
          ]}
          horizontal
          selectedValue={{
            value: 'placa',
            content: (
              <div className="inline-flex items-center gap-4">
                <p className="text-sm">Placa</p>
              </div>
            )
          }}
          setSelectedOption={setVehicleCategory}
        />
        {vehicleCategory === 'placa' ? (
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <form.LicensePlateInput
                control={control}
                register={register}
                error={errors.Placa}
              />
            </div>
            <buttons.SecondaryButton
              type="button"
              handler={async () => {
                setLoading(true)
                await axios
                  .get(
                    `${process.env.NEXT_PUBLIC_INFOCAR_URL}/api/acoes/cadastrar-veiculo`,
                    {
                      params: {
                        licensePlate: watch('Placa').split('-').join('')
                      }
                    }
                  )
                  .then((response: { data: any }) => {
                    setValue('Categoria_Id', {
                      key: response.data.data[0][0].CATEGORIA_VEICULO[0],
                      title: response.data.data[0][0].CATEGORIA_VEICULO[0]
                    })
                    setApiData(response.data.data)
                  })
                  .catch((err) => {
                    setValue('Categoria_Id', undefined)
                    showError(err)
                  })
                setLoading(false)
              }}
              title={<icons.ViewIcon />}
              disabled={disableSearchButton()}
              loading={loading}
              buttonClassName="h-10"
            />
          </div>
        ) : (
          <form.Input
            fieldName={'Chassi'}
            title={`Número do chassi`}
            register={register}
          />
        )}

        <Controller
          control={control}
          name="Categoria_Id"
          render={({ field: { onChange, value } }) => (
            <div>
              <form.Select
                itens={
                  vehiclesTypeData
                    ? vehiclesTypeData.map((item) => {
                        return {
                          key: item.Id,
                          title: item.Nome as string
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                error={errors.Categoria_Id}
                label="Categoria"
                disabled={vehicleCategory === 'placa'}
              />
            </div>
          )}
        />
        <form.Input
          fieldName={'Apelido'}
          title={`Apelido`}
          register={register}
        />
        <Controller
          control={control}
          name="Cliente_Id"
          render={({ field: { onChange, value } }) => (
            <div>
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
                error={errors.Cliente_Id}
                label="Cliente"
              />
              <common.OpenModalLink
                onClick={() =>
                  router.push(rotas.erp.identidades.clientes.cadastrar)
                }
              >
                Cadastrar Cliente
              </common.OpenModalLink>
            </div>
          )}
        />
        {vehicleCategory === 'chassi' && (
          <common.UploadFilePDF
            Id={''}
            path="vehicle"
            documentName="NOTAFISCAL"
            title="Clique para fazer upload da sua Nota fiscal em PDF"
            apiRoute="/api/upload/veiculo"
            disabled
          />
        )}
      </div>
      <common.Separator />
      <buttons.PrimaryButton
        title="Enviar"
        disabled={createVehicleLoading}
        loading={createVehicleLoading}
      />
    </form>
  )
}
