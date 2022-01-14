import rotas from '@/domains/routes'
import * as localizations from '@/domains/erp/monitoring/Localization'
import { InformationCircleIcon } from '@heroicons/react/solid'

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
    coordsToCenterMap
  } = localizations.useLocalization()

  const [google, setGoogle] = useState()
  const allMarkerVehiclesStep: google.maps.Marker[] = []
  const [allMarkerVehicles, setAllMarkerVehicles] = useState<
    google.maps.Marker[]
  >([])
  const [mapa, setMapa] = useState<google.maps.Map>()
  const infoWindowToRemove: google.maps.InfoWindow[] = []
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
        setGoogle(response)
        const mapGoogle = new response.maps.Map(
          document.getElementById('googleMaps') as HTMLElement,
          {
            center: {
              lat: -12.100100128939063,
              lng: -49.24919742233473
            },
            zoom: 5,
            mapTypeId: response.maps.MapTypeId.ROADMAP
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
        mapGoogle.controls[response.maps.ControlPosition.LEFT_CENTER].push(
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
          updateVehicleMarker(marker, vehicle, mapa!, infoWindowToRemove)
          return
        }

        createNewVehicleMarker(
          mapa,
          vehicle,
          allMarkerVehiclesStep,
          infoWindowToRemove!
        )
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
    if (coordsToCenterMap && google) centerMapInVehicle(coordsToCenterMap, mapa)
  }, [coordsToCenterMap])

  return (
    <MapTemplate
      reload={{ action: localizationsRefetch, state: localizationsLoading }}
      title="Localização"
      currentLocation={[
        { title: 'Dashboard', url: rotas.erp.home },
        { title: 'Localização', url: rotas.erp.monitoramento.localizacao }
      ]}
    >
      <div className="absolute z-50 h-5/6 right-0 flex items-center">
        <div className="h-20 w-7">
          <localizations.InternalNavigation />
        </div>
      </div>

      <localizations.SlidePanel />
      <div className="h-full w-full">
        <div className="w-full h-full" id="googleMaps" />
      </div>
    </MapTemplate>
  )
}

function createNewVehicleMarker(
  map: google.maps.Map | undefined,
  vehicle: vehicle,
  allMarkerVehiclesStep: google.maps.Marker[] | any[],
  infoWindowToRemove: google.maps.InfoWindow[]
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

  marker.addListener('click', async () => {
    if (infoWindowToRemove) {
      infoWindowToRemove.forEach((info) => info.close())
      infoWindowToRemove.length = 0
    }

    const addres = await getVehicleAddress(vehicle.latitude, vehicle.longitude)
    const infowindow = new google.maps.InfoWindow({
      content: `<div class='text-dark-7 w-80 m-0'>
      <div class='grid grid-cols-3'>
      <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold rounded-l-md py-2 border-2 !border-white '> ${
        vehicle.placa
      }</div>
      <div class='grid-span-1  flex bg-theme-22  justify-center items-center font-semibold border-2  py-2 !border-white' >
      <div class='mr-1 ${
        vehicle.ligado
          ? Number(vehicle.speed).toFixed() === '0'
            ? 'text-theme-10'
            : 'text-theme-9'
          : 'text-theme-13'
      }'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
      </div><span>${
        vehicle.ligado
          ? Number(vehicle.speed).toFixed() === '0'
            ? ' Parado'
            : ' Ligado'
          : ' Desligado'
      }</span>
      </div>
      <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold border-2 !border-white rounded-r-md py-2'>${Math.floor(
        Number(vehicle.speed)
      )} km/h</div> 
      </div>
      
      <div class="my-2">
      <p><b>Última atualização: ${new Date(
        vehicle.date_rastreador
      ).toLocaleDateString('pt-br', {
        dateStyle: 'short'
      })}
      ${new Date(vehicle.date_rastreador).toLocaleTimeString('pt-br', {
        timeStyle: 'medium'
      })}</b> </p>
      <p><b>${vehicle.veiculo}</b> </p>
      <p><b>${'NOME DO MOTORISTA'}</b> </p>
      <p><b>${addres}</b> </p>
      </div>
      <button class='bg-theme-9 dark:bg-theme-1 dark:text-white font-semibold w-full bottom-0 rounded-sm'><a href='/erp/monitoramento/trajetos/${
        vehicle.carro_id
      }?placa=${
        vehicle.placa
      }' class='flex w-full justify-center items-center h-8'>Ver trajeto</a></button>
      </div>`
    })
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    })
    infoWindowToRemove.push(infowindow)
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
  map: google.maps.Map | undefined
) {
  if (map && coords) {
    map.setCenter(coords)
    map.setZoom(18)
  }

  const circleMarker = new google.maps.Marker({
    map,
    zIndex: 1,
    position: coords,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 20,
      strokeWeight: 1,
      strokeColor: 'red',
      fillColor: 'yellow',
      fillOpacity: 1
    }
  })
  const intervalColor = setInterval(() => {
    const icon = circleMarker.getIcon()
    if (icon.fillOpacity <= 0.01) {
      circleMarker.setMap(null)
      clearInterval(intervalColor)
    }
    icon.fillOpacity -= 0.01
    icon.strokeOpacity -= 0.01

    circleMarker.setIcon(icon)
  }, 30)
}

function updateVehicleMarker(
  marker: google.maps.Marker,
  vehicle: vehicle,
  map: google.maps.Map,
  infoWindowToRemove: google.maps.InfoWindow[]
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

  google.maps.event.clearListeners(marker, 'click')

  marker.addListener('click', async () => {
    if (infoWindowToRemove) {
      infoWindowToRemove.forEach((info) => info.close())
      infoWindowToRemove.length = 0
    }

    const addres = await getVehicleAddress(vehicle.latitude, vehicle.longitude)
    const infowindow = new google.maps.InfoWindow({
      content: `<div class='text-dark-7 w-80 m-0'>
      <div class='grid grid-cols-3'>
      <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold rounded-l-md py-2 border-2 !border-white '> ${
        vehicle.placa
      }</div>
      <div class='grid-span-1  flex bg-theme-22  justify-center items-center font-semibold border-2  py-2 !border-white' >
      <div class='mr-1 ${
        vehicle.ligado
          ? Number(vehicle.speed).toFixed() === '0'
            ? 'text-theme-10'
            : 'text-theme-9'
          : 'text-theme-13'
      }'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
      </div><span>${
        vehicle.ligado
          ? Number(vehicle.speed).toFixed() === '0'
            ? ' Parado'
            : ' Ligado'
          : ' Desligado'
      }</span>
      </div>
      <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold border-2 !border-white rounded-r-md py-2'>${Math.floor(
        Number(vehicle.speed)
      )} km/h</div> 
      </div>
      
      <div class="my-2">
      <p><b>Última atualização: ${new Date(
        vehicle.date_rastreador
      ).toLocaleDateString('pt-br', {
        dateStyle: 'short'
      })}
      ${new Date(vehicle.date_rastreador).toLocaleTimeString('pt-br', {
        timeStyle: 'medium'
      })}</b> </p>
      <p><b>${vehicle.veiculo}</b> </p>
      <p><b>${'NOME DO MOTORISTA'}</b> </p>
      <p><b>${addres}</b> </p>
      </div>
      <button class='bg-theme-9 dark:bg-theme-1 dark:text-white font-semibold w-full bottom-0 rounded-sm'><a href='/erp/monitoramento/trajetos/${
        vehicle.carro_id
      }?placa=${
        vehicle.placa
      }' class='flex w-full justify-center items-center h-8'>Ver trajeto</a></button>
      </div>`
    })
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    })
    infoWindowToRemove.push(infowindow)
  })
}

async function getVehicleAddress(lat: string, lng: string) {
  const response = await getStreetNameByLatLng(lat, lng)
  return response.results[0].formatted_address
}
