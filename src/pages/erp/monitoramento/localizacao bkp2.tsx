import rotas from '@/domains/routes'
import * as localizations from '@/domains/erp/monitoring/Localization'
import { XIcon } from '@heroicons/react/outline'

import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useState } from 'react'
import MapTemplate from '@/templates/MapTemplate'
import { getStreetNameByLatLng } from '@/domains/erp/monitoring/api'

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

export default function Localizacao() {
  return (
    <localizations.LocalizationProvider>
      <Page />
    </localizations.LocalizationProvider>
  )
}

export function Page() {
  const {
    localizationsRefetch,
    localizationsLoading,
    allUserVehicle,
    coordsToCenterMap,
    vehicleConsultData
  } = localizations.useLocalization()

  let google: any
  const allMarkerVehiclesStep: google.maps.Marker[] = []
  const [allMarkerVehicles, setAllMarkerVehicles] = useState<
    google.maps.Marker[]
  >([])
  const [mapa, setMapa] = useState<google.maps.Map>()
  const [layoutType, setLayoutType] = useState(false)

  function initMap() {
    const loader = new Loader({
      apiKey: 'AIzaSyA13XBWKpv6lktbNrPjhGD_2W7euKEZY1I',
      version: 'weekly',
      libraries: ['geometry']
    })
    const styles = [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      }
    ]
    loader
      .load()
      .then((response) => {
        google = response
        const mapGoogle = new google.maps.Map(
          document.getElementById('googleMaps') as HTMLElement,
          {
            center: {
              lat: -12.100100128939063,
              lng: -49.24919742233473
            },
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
        )
        mapGoogle.setOptions({ styles })

        const controlDiv = document.createElement('div')
        const controlUI = document.createElement('button')

        controlUI.classList.add('ui-button')
        controlUI.innerText = `texto`
        controlUI.addEventListener('click', () => {
          console.log('click')
        })
        controlDiv.appendChild(controlUI)
        mapGoogle.controls[google.maps.ControlPosition.LEFT_CENTER].push(
          controlDiv
        )

        setMapa(mapGoogle)
      })
      .catch((e) => {
        console.log('error: ', e)
      })
  }

  useEffect(() => {
    initMap()
  }, [])

  useEffect(() => {
    allUserVehicle
      ?.filter((vehicle) => {
        if (vehicle.latitude && vehicle.longitude) return vehicle
      })
      .forEach((vehicle) => {
        const marker = allMarkerVehicles.find((elem) => {
          if (elem.id === vehicle.carro_id) return elem
        })
        if (marker) {
          updateVehicleMarker(marker, vehicle, mapa!)
          return
        }

        createNewVehicleMarker(mapa, vehicle, allMarkerVehiclesStep)
      })
    const markersToAdd = allMarkerVehiclesStep.filter((markerStep) => {
      const validationMarker = allMarkerVehicles.find((elem) => {
        if (elem.id === markerStep.id) {
          return elem
        }
      })
      if (validationMarker) return
      return markerStep
    })
    setAllMarkerVehicles([...allMarkerVehicles, ...markersToAdd])
  }, [allUserVehicle])

  useEffect(() => {
    centerMapInVehicle(coordsToCenterMap, mapa, allMarkerVehicles)
  }, [coordsToCenterMap])

  return (
    <MapTemplate
      reload={{ action: localizationsRefetch, state: localizationsLoading }}
      title="Localização"
      allUserVehicle={allUserVehicle}
      currentLocation={[
        { title: 'Dashboard', url: rotas.erp.home },
        { title: 'Localização', url: rotas.erp.monitoramento.localizacao }
      ]}
      layoutType={layoutType}
      setLayoutType={setLayoutType}
    >
      {!layoutType && (
        <div className="absolute z-50 h-5/6 right-0 flex items-center">
          <div className="h-20 w-7">
            <localizations.InternalNavigation />
          </div>
        </div>
      )}

      <localizations.SlidePanel />
      <div className="h-full w-full">
        <div className="w-full h-full" id="googleMaps" />
        {layoutType && (
          <VehicleDetails vehicleConsultData={vehicleConsultData} />
        )}
      </div>
    </MapTemplate>
  )
}

function createNewVehicleMarker(
  map: google.maps.Map | undefined,
  vehicle: vehicle,
  allMarkerVehiclesStep: google.maps.Marker[] | any[]
) {
  const marker = new google.maps.Marker({
    map,
    zIndex: 2,
    id: vehicle.carro_id,
    position: { lat: Number(vehicle.latitude), lng: Number(vehicle.longitude) },
    icon: {
      path: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
      scale: 0.5,
      strokeWeight: 0.7,
      fillColor: setVehicleColor(vehicle),
      fillOpacity: 1,
      anchor: new google.maps.Point(10, 25),
      rotation: Number(vehicle.crs)
    }
  })
  const infowindow = new google.maps.InfoWindow({
    content: `<div class='text-dark-7'>
    <p><b>Placa:</b> ${vehicle.placa}</p>
    <p><b>Velocidade:</b> ${Math.floor(Number(vehicle.speed))} km/h</p>
    <p><b>Ignição:</b> ${vehicle.ligado ? 'Ligado' : 'Desligado'}</p>
    </div> `
  })
  marker.addListener('mouseover', () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    })
  })
  marker.addListener('mouseout', () => {
    infowindow.close()
  })
  allMarkerVehiclesStep.push(marker)
}

function setVehicleColor(vehicle: vehicle) {
  const dataHora = new Date()
  dataHora.setHours(dataHora.getHours() - 1)

  if (new Date(vehicle.date_rastreador) < dataHora) return '#ff0000'

  if (vehicle.ligado) {
    if (Number(vehicle.speed).toFixed() === '0') return '#22ade4'

    return '#009933'
  }

  return '#818181'
}

function centerMapInVehicle(
  coords: { lat: number; lng: number; carro_id: number } | undefined,
  map: google.maps.Map | undefined,
  allMarkerVehicles: google.maps.Marker[]
) {
  if (map && coords) {
    map.setCenter(coords)
    map.setZoom(16)
  }
  const marker = allMarkerVehicles.find((vehicleMarker) => {
    if (vehicleMarker.id === coords?.carro_id) return vehicleMarker
  })

  if (marker) {
    const icon = marker.getIcon()
    const color = icon.fillColor
    icon.fillColor = '#fffb00'
    marker.setIcon(icon)
    setTimeout(() => {
      icon.fillColor = color
      marker.setIcon(icon)
    }, 5000)
  }
}

function updateVehicleMarker(
  marker: google.maps.Marker,
  vehicle: vehicle,
  map: google.maps.Map
) {
  const currentMarkerPos = new google.maps.LatLng(
    Number(vehicle.latitude),
    Number(vehicle.longitude)
  )
  marker.setPosition(currentMarkerPos)

  const icon = marker.getIcon()
  icon.fillColor = setVehicleColor(vehicle)
  icon.rotation = Number(vehicle.crs)
  marker.setIcon(icon)

  const infowindow = new google.maps.InfoWindow({
    content: `<div class='text-dark-7'>
    <p><b>Placa:</b> ${vehicle.placa}</p>
    <p><b>Velocidade:</b> ${Math.floor(Number(vehicle.speed))} km/h</p>
    <p><b>Ignição:</b> ${vehicle.ligado ? 'Ligado' : 'Desligado'}</p>
    </div> `
  })

  google.maps.event.clearListeners(marker, 'mouseover')
  google.maps.event.clearListeners(marker, 'mouseout')

  marker.addListener('mouseover', () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    })
  })
  marker.addListener('mouseout', () => {
    infowindow.close()
  })
}

function VehicleDetails({ vehicleConsultData }) {
  const [dataAddres, setDataAddres] = useState('')
  const [open, setOpen] = useState(true)

  async function getStreetName(vehicleConsultData: vehicle) {
    const response = await getStreetNameByLatLng(
      vehicleConsultData.latitude,
      vehicleConsultData.longitude
    )

    setDataAddres(response.results[0].formatted_address)
  }

  useEffect(() => {
    setDataAddres('')
    setOpen(true)
  }, [vehicleConsultData])

  return (
    <>
      {vehicleConsultData && open && (
        <div className="absolute h-48 w-80 -mt-56 ml-8 bg-dark-3 z-40 rounded-md overflow-auto">
          <div className="flex w-full bg-dark-7 p-2 justify-between items-center">
            {' '}
            <span className="font-black">Informações sobre o veículo</span>
            <button
              data-testid="button"
              type="button"
              className="text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Fechar painel</span>

              <XIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <div className="p-2">
            <p>
              <b>Última atualização:</b>{' '}
              {new Date(vehicleConsultData.date_rastreador).toLocaleDateString(
                'pt-br',
                {
                  dateStyle: 'short'
                }
              )}{' '}
              {new Date(vehicleConsultData.date_rastreador).toLocaleTimeString(
                'pt-br',
                {
                  timeStyle: 'medium'
                }
              )}
            </p>
            <p>
              <b>Placa:</b> {vehicleConsultData.placa}
            </p>
            <p>
              <b>Velocidade:</b> {Math.floor(Number(vehicleConsultData.speed))}{' '}
              km/h
            </p>
            <p>
              <b>Ignição:</b>{' '}
              {vehicleConsultData.ligado ? 'Ligado' : 'Desligado'}
            </p>
            <p>
              <b>Endereço:</b>{' '}
              {dataAddres ? (
                <span>{dataAddres}</span>
              ) : (
                <button
                  className="underline"
                  onClick={() => {
                    getStreetName(vehicleConsultData)
                  }}
                >
                  Clique aqui para consultar
                </button>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
