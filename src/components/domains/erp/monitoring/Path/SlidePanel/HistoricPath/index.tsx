import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as paths from '@/domains/erp/monitoring/Path'
import * as common from '@/common'

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { showError } from 'utils/showError'

import {
  ChevronLeftIcon,
  ExclamationIcon,
  ClockIcon,
  LocationMarkerIcon,
  MapIcon
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'

type vehicle = {
  crs: string
  data: string
  dist: string
  latitude: string
  ligado: number
  longitude: string
  speed: string
  carro_id?: number
  placa?: string
  chassis?: string
  renavan?: string
  ano_modelo?: string
  cor?: string
  veiculo?: string
  carro_fabricante?: string
  carro_categoria?: string
  carro_tipo?: string
  combustivel?: string
  ano?: string
  frota?: string
  imei?: string
  date_rastreador?: string
}

type FormData = {
  Veiculos: {
    key: string
    title: string
  }
  DateStart: string
  DateEnd: string
}
export default function CreatePath() {
  const [moreDetails, setMoreDetails] = useState(false)
  const router = useRouter()

  const {
    pathSchema,
    pathsLoading,
    consultVehicleHistoric,
    allUserVehicle,
    vehicleConsultData,
    setVehicleConsultData,
    setSelectedVehicle
  } = paths.usePath()
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(pathSchema)
  })
  const [vehicleConsultDataFiltered, setVehicleConsultDataFiltered] =
    useState(vehicleConsultData)
  const onSubmit = (formData: FormData) => {
    try {
      if (
        formData.Veiculos === undefined ||
        formData.Veiculos.title === undefined
      ) {
        throw new Error('Selectione um veículo')
      }

      consultVehicleHistoric(
        formData.Veiculos.key.toString(),
        formData.DateStart,
        formData.DateEnd
      )
      const selectedVehicle = allUserVehicle?.find((vehicleFind) => {
        if (vehicleFind.carro_id === Number(formData.Veiculos.key)) {
          return vehicleFind
        }
      })
      setSelectedVehicle(selectedVehicle)
    } catch (err: any) {
      showError(err)
    }
  }

  function currentDateAndTime(type = '') {
    const date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    if (day < 10) day = '0' + day
    if (month < 10) month = '0' + month

    if (type === 'onlyDate') return year + '-' + month + '-' + day + 'T00:00:00'

    let hour = date.getHours()
    let minute = date.getMinutes()
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute

    return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00'
  }

  function filterConsult(item: string) {
    let result: vehicle[]
    switch (item) {
      case 'Visualizar todos':
        setVehicleConsultDataFiltered(vehicleConsultData)
        break
      case 'Eventos de velocidade':
        result = vehicleConsultData?.filter((vehicle) => {
          if (Number(vehicle.speed) > 80) {
            return vehicle
          }
        })
        setVehicleConsultDataFiltered(result)
        break
      case 'Ignição ligada e parado':
        result = vehicleConsultData?.filter((vehicle) => {
          if (Number(vehicle.speed) < 1 && vehicle.ligado === 1) {
            return vehicle
          }
        })
        setVehicleConsultDataFiltered(result)

        break
    }
  }

  function getTotalStops() {
    if (vehicleConsultData?.length > 0) {
      let statusVehicle = vehicleConsultData[0].ligado

      return vehicleConsultData.reduce((totalStops, currPoint) => {
        if (statusVehicle !== currPoint.ligado) {
          statusVehicle = currPoint.ligado
          if (statusVehicle === 0) {
            return totalStops + 1
          }
        }
        return totalStops
      }, 0)
    }
    return 0
  }
  function getTotalDownTime() {
    if (vehicleConsultData?.length > 0) {
      let statusVehicle = vehicleConsultData[0].ligado
      let timeLastStop = new Date(vehicleConsultData[0].data)

      const durationMs = vehicleConsultData.reduce((DownTime, currPoint) => {
        if (statusVehicle !== currPoint.ligado) {
          statusVehicle = currPoint.ligado
          if (statusVehicle === 0) {
            const thisStop = Math.abs(new Date(currPoint.data) - timeLastStop)
            return DownTime + thisStop
          }
          timeLastStop = new Date(currPoint.data)
        }
        return DownTime
      }, 0)

      let seconds = Math.floor((durationMs / 1000) % 60)
      let minutes = Math.floor((durationMs / (1000 * 60)) % 60)
      let hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24)

      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds

      return hours + ':' + minutes + ':' + seconds
    }
    return '00:00:00'
  }
  function getAverageSpeed() {
    if (vehicleConsultData.length > 0) {
      const vehicleConsultDataFiltredEngineRunnig = vehicleConsultData.filter(
        (vehicle) => {
          if (vehicle.ligado === 1 && Number(vehicle.speed) > 0) return vehicle
        }
      )
      const sumSpeed = vehicleConsultDataFiltredEngineRunnig.reduce(
        (acc, cur) => {
          return acc + Number(cur.speed)
        },
        0
      )

      return (sumSpeed / vehicleConsultDataFiltredEngineRunnig.length).toFixed()
    }
    return '0'
  }

  useEffect(() => {
    setVehicleConsultData(undefined)

    reset({
      DateStart: currentDateAndTime('onlyDate'),
      DateEnd: currentDateAndTime(),
      Veiculos: {
        key: Number(router.query.carro_id),
        title: router.query.placa
      }
    })
  }, [reset, router])

  useEffect(() => {
    if (router.query.carro_id && allUserVehicle) {
      const formData = {
        Veiculos: {
          key: Number(router.query.carro_id),
          title: router.query.placa
        },
        DateStart: currentDateAndTime('onlyDate'),
        DateEnd: currentDateAndTime()
      }

      onSubmit(formData)
    }
  }, [router, allUserVehicle])

  useEffect(() => {
    setVehicleConsultDataFiltered(vehicleConsultData)
  }, [vehicleConsultData])

  return (
    <>
      {moreDetails ? (
        <>
          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                setMoreDetails(false)
              }}
              className=" justify-center items-center flex"
            >
              <ChevronLeftIcon
                className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />{' '}
              Voltar
            </button>
            <common.Dropdown
              title={'Filtro'}
              handler={filterConsult}
              items={[
                'Visualizar todos',
                'Eventos de velocidade',
                'Ignição ligada e parado'
              ]}
            />
          </div>
          {vehicleConsultDataFiltered?.length !== 0 ? (
            <div className="relative mt-5 report-timeline">
              {vehicleConsultDataFiltered?.map((vehicle, index) => {
                return (
                  <common.VehicleCard
                    key={index}
                    vehicle={vehicle}
                    description={
                      <div>
                        <p>Situação: {vehicle.speed}</p>
                      </div>
                    }
                  />
                )
              })}
            </div>
          ) : (
            <div className="w-full flex justify-center mt-4">
              <common.EmptyContent />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-flow-col w-full gap-2 mb-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-12"
            >
              <Controller
                control={control}
                name="Veiculos"
                render={({ field: { onChange, value } }) => (
                  <div className="col-span-12">
                    <form.Select
                      itens={
                        allUserVehicle
                          ? allUserVehicle
                              .filter((item) => {
                                if (item.placa != null) return item
                              })
                              .map((item) => {
                                return {
                                  key: item.carro_id,
                                  title: item.placa as string
                                }
                              })
                          : []
                      }
                      value={value}
                      onChange={(value) => {
                        onChange(value)
                      }}
                      error={errors.Cliente_Id}
                      label="Veiculos"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="DateStart"
                render={({ field: { onChange, value } }) => (
                  <div className="col-span-12 mt-2">
                    <p>De:</p>
                    <input
                      type="datetime-local"
                      className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md w-full"
                      value={value}
                      max={currentDateAndTime()}
                      onChange={onChange}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="DateEnd"
                render={({ field: { onChange, value } }) => (
                  <div className="col-span-12 my-2">
                    <p>Até:</p>
                    <input
                      type="datetime-local"
                      className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md w-full"
                      value={value}
                      max={currentDateAndTime()}
                      onChange={onChange}
                    />
                  </div>
                )}
              />
              <buttons.PrimaryButton
                title="Consultar"
                className="col-span-3 justify-center flex"
                disabled={pathsLoading}
                loading={pathsLoading}
              />
            </form>
          </div>

          <common.Separator />
          <div className="w-full mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-black text-lg">Informações sobre o trajeto</p>
              <buttons.SecondaryButton
                handler={() => {
                  setMoreDetails(true)
                  filterConsult('Visualizar todos')
                }}
                title="Mais detalhes"
                className="col-span-3 justify-center flex"
                disabled={
                  pathsLoading ||
                  vehicleConsultData?.length < 1 ||
                  vehicleConsultData === undefined
                }
              />
            </div>
            {vehicleConsultData?.length > 0 ? (
              <div className="relative mt-5 report-timeline">
                <common.ListCard
                  icon={<ExclamationIcon className="w-6 h-6" />}
                  title={'Eventos de velocidade'}
                  description={
                    <div>
                      <p>
                        {vehicleConsultData.reduce((acc, curr) => {
                          if (Number(curr.speed) > 80) {
                            return acc + 1
                          }
                          return acc
                        }, 0)}
                      </p>
                    </div>
                  }
                />
                <common.ListCard
                  icon={<LocationMarkerIcon className="w-6 h-6" />}
                  title={'Quantidade de paradas'}
                  description={<p>{getTotalStops()}</p>}
                />
                <common.ListCard
                  icon={<ClockIcon className="w-6 h-6" />}
                  title={'Tempo parado'}
                  description={<p>{getTotalDownTime()}</p>}
                />
                <common.ListCard
                  icon={<MapIcon className="w-6 h-6" />}
                  title={'Velocidade média'}
                  description={
                    <div>
                      <p>{getAverageSpeed() + ' Km'}</p>
                    </div>
                  }
                />
                <common.ListCard
                  icon={<MapIcon className="w-6 h-6" />}
                  title={'Distância percorrida'}
                  description={
                    <div>
                      <p>
                        {vehicleConsultData?.length > 0
                          ? (
                              (Number(
                                vehicleConsultData[
                                  vehicleConsultData.length - 1
                                ].dist
                              ) -
                                Number(vehicleConsultData[0].dist)) /
                              1000
                            ).toFixed(1) + ' Km'
                          : '0 km'}
                      </p>
                    </div>
                  }
                />
              </div>
            ) : pathsLoading ? (
              <>
                <div className=" w-full">
                  {['', '', '', '', ''].map((_, index) => (
                    <div key={index} className="mb-2 grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <Skeleton
                          baseColor="rgb(41, 49, 69)"
                          highlightColor="rgb(63, 72, 101)"
                          height={56}
                          circle
                        />
                      </div>
                      <div className="col-span-10">
                        <Skeleton
                          baseColor="rgb(41, 49, 69)"
                          highlightColor="rgb(63, 72, 101)"
                          height={56}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : vehicleConsultData ? (
              <div className="w-full flex justify-center mt-4">
                <common.EmptyContent />
              </div>
            ) : (
              <div className="w-full flex justify-center mt-4"></div>
            )}
          </div>
        </>
      )}
    </>
  )
}
