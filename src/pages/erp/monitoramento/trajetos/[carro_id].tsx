import rotas from '@/domains/routes'
import MapTemplate from '@/templates/MapTemplate'

import * as paths from '@/domains/erp/monitoring/Path'

import { Loader } from '@googlemaps/js-api-loader'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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

export default function Trajetos() {
  return (
    <paths.PathProvider>
      <Page />
    </paths.PathProvider>
  )
}

export function Page() {
  const {
    vehicleConsultData,
    coordsToCenterPointInMap,
    allUserVehicle,
    selectedVehicle,
    setSlidePanelState
  } = paths.usePath()
  const [pointMarker, setPointMarker] = useState<
    google.maps.Marker | undefined
  >()
  const [mapa, setMapa] = useState<google.maps.Map>()
  const [google, setGoogle] = useState()
  const [markersAndLine, setMarkersAndLine] = useState<{
    markers: google.maps.Marker[]
    line: google.maps.Polyline
  }>()
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
        const map = new response.maps.Map(
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
        map.setOptions({ styles })
        setMapa(map)
      })
      .catch((e) => {
        console.log('error: ', e)
      })
  }

  useEffect(() => {
    initMap()
    setSlidePanelState({
      open: true
    })
  }, [])

  useEffect(() => {
    if (vehicleConsultData?.length > 0) {
      createNewCarMarker(
        infoWindowToRemove,
        selectedVehicle,
        mapa!,
        google,
        vehicleConsultData,
        markersAndLine,
        setMarkersAndLine
      )
    }
  }, [vehicleConsultData])

  useEffect(() => {
    if (coordsToCenterPointInMap && mapa)
      centerPointInMap(
        coordsToCenterPointInMap,
        mapa,
        google,
        pointMarker,
        setPointMarker
      )
  }, [coordsToCenterPointInMap])

  return (
    <MapTemplate
      title="Trajetos"
      currentLocation={[
        { title: 'Dashboard', url: rotas.erp.home },
        { title: 'Trajetos', url: rotas.erp.monitoramento.trajetos }
      ]}
    >
      <div className="absolute z-50 h-5/6 right-0 flex items-center">
        <div className="h-20 w-7">
          <paths.InternalNavigation />
        </div>
      </div>
      <paths.SlidePanel />
      <div className="h-full w-full">
        <div className="w-full h-full" id="googleMaps" />
      </div>
    </MapTemplate>
  )
}
function createNewCarMarker(
  infoWindowToRemove: google.maps.InfoWindow[],
  selectedVehicle: vehicle,
  map: google.maps.Map,
  google: any,
  pathCoords: vehicle[],
  markersAndLine:
    | {
        markers: google.maps.Marker[]
        line: google.maps.Polyline
      }
    | undefined,
  setMarkersAndLine: Dispatch<
    SetStateAction<
      | {
          markers: google.maps.Marker[]
          line: google.maps.Polyline
        }
      | undefined
    >
  >
) {
  if (markersAndLine) {
    markersAndLine.markers.forEach((marker) => marker.setMap(null))

    markersAndLine.line.getPath().clear()
  }

  map.setCenter({
    lat: Number(pathCoords[pathCoords.length - 1].latitude),
    lng: Number(pathCoords[pathCoords.length - 1].longitude)
  })
  map.setZoom(10)
  const markers = []
  const marker = new google.maps.Marker({
    map,
    position: {
      lat: Number(pathCoords[pathCoords.length - 1].latitude),
      lng: Number(pathCoords[pathCoords.length - 1].longitude)
    },
    zIndex: 2,
    icon: {
      path: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
      scale: 0.5,
      strokeWeight: 0.7,
      fillColor: '#009933',
      fillOpacity: 1,
      anchor: new google.maps.Point(10, 25),
      rotation: Number(pathCoords[pathCoords.length - 1].crs)
    }
  })
  marker.addListener('click', async () => {
    if (infoWindowToRemove) {
      infoWindowToRemove.forEach((info) => info.close())
      infoWindowToRemove.length = 0
    }
    const addres = await getVehicleAddress(
      pathCoords[pathCoords.length - 1].latitude,
      pathCoords[pathCoords.length - 1].longitude
    )
    const infowindow = new google.maps.InfoWindow({
      content: `<div class='text-dark-7 w-80 m-0'>
      <div class='grid grid-cols-3'>
      <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold rounded-l-md py-2 border-2 !border-white '> ${
        selectedVehicle.placa
      }</div>
      <div class='grid-span-1  flex bg-theme-22  justify-center items-center font-semibold border-2  py-2 !border-white' >
      <div class='mr-1 ${
        pathCoords[pathCoords.length - 1].ligado
          ? Number(pathCoords[pathCoords.length - 1].speed).toFixed() === '0'
            ? 'text-theme-10'
            : 'text-theme-9'
          : 'text-theme-13'
      }'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
      </div><span>${
        pathCoords[pathCoords.length - 1].ligado
          ? Number(pathCoords[pathCoords.length - 1].speed).toFixed() === '0'
            ? ' Parado'
            : ' Ligado'
          : ' Desligado'
      }</span>
      </div>
      <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold border-2 !border-white rounded-r-md py-2'>${Math.floor(
        Number(pathCoords[pathCoords.length - 1].speed)
      )} km/h</div> 
      </div>
      
      <div class="my-2">
      <p><b>Última atualização: ${new Date(
        pathCoords[pathCoords.length - 1].data
      ).toLocaleDateString('pt-br', {
        dateStyle: 'short'
      })}
      ${new Date(pathCoords[pathCoords.length - 1].data).toLocaleTimeString(
        'pt-br',
        {
          timeStyle: 'medium'
        }
      )}</b> </p>
      <p><b>${selectedVehicle.veiculo}</b> </p>
      <p><b>${'NOME DO MOTORISTA'}</b> </p>
      <p><b>${addres}</b> </p>
      </div>
    </div>`
    })
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    })
    infoWindowToRemove.push(infowindow)
  })

  const markerStart = new google.maps.Marker({
    map,
    label: {
      text: 'Início',
      color: 'black',
      fontSize: '16px',
      fontWeight: 'bold',
      className: 'mb-5 ml-4'
    },
    icon: {
      path: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z',
      fillColor: 'green',
      fillOpacity: 1,
      anchor: new google.maps.Point(10, 0),
      scale: 1.5
    },
    position: {
      lat: Number(pathCoords[0].latitude),
      lng: Number(pathCoords[0].longitude)
    },
    zIndex: 2
  })

  const line = new google.maps.Polyline({
    path: [],
    strokeColor: '#223D90',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    geodesic: true,
    map
  })
  const lineForeground = new google.maps.Polyline({
    path: [],
    strokeColor: '#09ff00',
    strokeOpacity: 1,
    strokeWeight: 2,
    geodesic: true,
    map
  })

  renderPolyline()

  function renderPolyline() {
    line.getPath().clear()
    lineForeground.getPath().clear()
    let statusVehicle = pathCoords[0].ligado
    let timeLastStop = new Date(pathCoords[0].data)

    pathCoords.forEach((vehicle, index) => {
      let stop = false
      let durationMs = 0
      if (statusVehicle !== vehicle.ligado) {
        statusVehicle = vehicle.ligado
        if (statusVehicle === 0) {
          durationMs += Math.abs(new Date(vehicle.data) - timeLastStop)
          stop = true
        }
        timeLastStop = new Date(vehicle.data)
      }
      if (durationMs > 0) {
        let seconds = Math.floor((durationMs / 1000) % 60)
        let minutes = Math.floor((durationMs / (1000 * 60)) % 60)
        let hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24)

        if (hours < 10) hours = '0' + hours
        if (minutes < 10) minutes = '0' + minutes
        if (seconds < 10) seconds = '0' + seconds

        durationMs = hours + ':' + minutes + ':' + seconds
      }
      createMarkerWhitInfo(
        vehicle,
        pathCoords[index - 1],
        stop,
        durationMs,
        selectedVehicle,
        infoWindowToRemove
      )

      const arrival = new google.maps.LatLng(
        Number(vehicle.latitude),
        Number(vehicle.longitude)
      )
      line.getPath().push(arrival)
    })
    // animateIconPolyline(line)
  }

  function createMarkerWhitInfo(
    vehicle: vehicle,
    previousPosition: vehicle,
    stop: boolean,
    downTime: number,
    selectedVehicle: vehicle,
    infoWindowToRemove: google.maps.InfoWindow[]
  ) {
    let events = ''

    if (downTime !== 0) {
      events += `
      ${downTime} <span>tempo parado</span>`
    } else if (Number(vehicle.speed) > 80) {
      events += `
      <span>Velocidade:</span> ${Math.floor(
        Number(vehicle.speed)
      )} <span>Km/H</span>
      `
    }
    if (events === '') events = '<span>Não há evento registrado.</span> '
    // if (true /*Number(vehicle.speed) > 80 || stop*/) {

    const markerlocal = new google.maps.Marker({
      position: {
        lat: Number(vehicle.latitude),
        lng: Number(vehicle.longitude)
      },
      map,
      zIndex: 1,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 2.8,
        strokeWeight: 1,
        fillColor:
          previousPosition === undefined
            ? '#000'
            : stop && Number(vehicle.speed) < 1
            ? '#00ffdd'
            : stop
            ? '#2600ff'
            : Number(vehicle.speed) > 80
            ? '#ff8800'
            : '#000',
        fillOpacity: 1,
        rotation: Number(vehicle.crs) - 180
      }
    })
    markerlocal.addListener('click', async () => {
      if (infoWindowToRemove) {
        infoWindowToRemove.forEach((info) => info.close())
        infoWindowToRemove.length = 0
      }
      const addres = await getVehicleAddress(
        vehicle.latitude,
        vehicle.longitude
      )
      const infowindow = new google.maps.InfoWindow({
        content: `<div class='text-dark-7 w-80 m-0'>
        <div class='grid grid-cols-3'>
        <div class='grid-span-1 flex bg-theme-22  justify-center font-semibold rounded-l-md py-2 border-2 !border-white '> ${
          selectedVehicle.placa
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
        <p><b>Última atualização: ${new Date(vehicle.data).toLocaleDateString(
          'pt-br',
          {
            dateStyle: 'short'
          }
        )}
        ${new Date(vehicle.data).toLocaleTimeString('pt-br', {
          timeStyle: 'medium'
        })}</b> </p>
        <p><b>${selectedVehicle.veiculo}</b> </p>
        <p><b>${'NOME DO MOTORISTA'}</b> </p>
        <p><b>${addres}</b> </p>
        </div>
        
      <div> <b>Eventos:</b> </br>
      ${events}</div>
      </div>`
      })
      infowindow.open({
        anchor: markerlocal,
        map,
        shouldFocus: false
      })
      infoWindowToRemove.push(infowindow)
    })

    markers.push(markerlocal)
    // }
  }

  markers.push(marker)
  markers.push(markerStart)
  setMarkersAndLine({ markers, line })
}

function centerPointInMap(coords, map, google, pointMarker, setPointMarker) {
  if (pointMarker) pointMarker.setMap(null)

  map.setCenter({
    lat: Number(coords.latitude),
    lng: Number(coords.longitude)
  })
  map.setZoom(13)
  const markerPoint = new google.maps.Marker({
    map,
    animation: google.maps.Animation.BOUNCE,
    icon: {
      path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
      fillColor: '#FF0000',
      fillOpacity: 1,
      anchor: new google.maps.Point(0, 0),
      scale: 0.5
    },
    position: {
      lat: Number(coords.latitude),
      lng: Number(coords.longitude)
    },
    zIndex: 2
  })
  setPointMarker(markerPoint)
  setTimeout(() => {
    markerPoint.setMap(null)
  }, 3000)
}

function animateIconPolyline(line: google.maps.Polyline) {
  let count = 0

  window.setInterval(() => {
    count = (count + 1) % 200

    const icons = line.get('icons')

    icons[0].offset = count / 2 + '%'
    line.set('icons', icons)
  }, 200)
}
async function getVehicleAddress(lat: string, lng: string) {
  const response = await getStreetNameByLatLng(lat, lng)
  return response.results[0].formatted_address
}
