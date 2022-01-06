import rotas from '@/domains/routes'
import * as localizations from '@/domains/erp/monitoring/Localization'

import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useState } from 'react'
import MapTemplate from '@/templates/MapTemplate'

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
type locationProps = {
  lat: number | undefined
  lng: number | undefined
  velocity: number | undefined
  engineRunning: boolean | undefined
}
type locationArrayProps = {
  location: locationProps
}[]
type currentRouteProps = {
  location: locationProps
  marker?: boolean
  stopover?: boolean
  rotation?: number
}[]
type timerProps = {
  cancel?: (() => void) | undefined
  pause?: (() => void | undefined) | undefined
  resume?: (() => void | undefined) | undefined
  timeoutCallback?: (() => void) | undefined
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

  let google: any
  let line: google.maps.Polyline
  let marker: google.maps.Marker
  let timer: timerProps
  const [mapa, setMapa] = useState<google.maps.Map>()
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

        allUserVehicle
          ?.filter((vehicle) => {
            if (vehicle.latitude && vehicle.longitude) return vehicle
          })
          .map((vehicle) => {
            createNewVehicleMarker(mapGoogle, google, vehicle)
          })
        setMapa(mapGoogle)
      })
      .catch((e) => {
        console.log('error: ', e)
      })
  }
  function recursiveAnimate() {
    timer && timer.cancel ? timer.cancel() : null
    const icon = marker.getIcon()
    icon.fillColor = '#009933'
    marker.setIcon(icon)
    if (currentPos > pathCoords.length - 5) {
      icon.fillColor = '#ff0000'
      marker.setIcon(icon)
      timer && timer.pause ? timer.pause() : null
      noConection = true
      return
    }

    const departure = new google.maps.LatLng(
      pathCoords[currentPos].lat,
      pathCoords[currentPos].lng
    )
    const arrival = new google.maps.LatLng(
      pathCoords[currentPos + 1].lat,
      pathCoords[currentPos + 1].lng
    )
    if (
      departure.lat() === arrival.lat() &&
      departure.lng() === arrival.lng()
    ) {
      icon.fillColor = '#00d9ff'
      marker.setIcon(icon)
    }
    let step = 0
    const numSteps = 40 //Change this to set animation resolution
    const timePerStep = 250 //Change this to alter animation speed
    timer = InvervalTimer(function () {
      step += 1
      if (step > numSteps) {
        step = 0
        if (currentPos < pathCoords.length - 4) {
          createMarkerWhitInfo(pathCoords[currentPos + 1])
          currentPos++
          recursiveAnimate()
          return
        }
      } else {
        const are_we_there_yet = google.maps.geometry.spherical.interpolate(
          departure,
          arrival,
          step / numSteps
        )
        line.getPath().push(are_we_there_yet)
        moveMarker(marker, departure, are_we_there_yet)
        return
      }
    }, timePerStep)
  }
  function renderPolylineToInitialPos(index: number) {
    const paths = pathCoords.slice(0, index + 1)
    paths.forEach((path) => {
      createMarkerWhitInfo(path)
    })
    const flightPath = new google.maps.Polyline({
      path: paths,
      strokeColor: '#4da9d8',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      geodesic: true
    })

    flightPath.setMap(map)
  }
  function moveMarker(
    marker: google.maps.Marker,
    departure: google.maps.LatLng,
    currentMarkerPos: google.maps.LatLng
  ) {
    marker.setPosition(currentMarkerPos)

    if (
      departure.lat() !== currentMarkerPos.lat() &&
      departure.lng() !== currentMarkerPos.lng()
    ) {
      const heading = google.maps.geometry.spherical.computeHeading(
        departure,
        currentMarkerPos
      )
      const icon = marker.get('icon')
      icon.rotation = heading
      marker.setIcon(icon)
    }
  }
  function addPathCoords() {
    if (addicionalPathCoords[0][0].lat !== undefined) {
      pathCoords.push(...addicionalPathCoords.shift())
      return
    }
    addicionalPathCoords.shift()
  }

  useEffect(() => {
    initMap()
  }, [allUserVehicle])

  useEffect(() => {
    centerMapInVehicle(coordsToCenterMap, mapa)
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
      <div className="absolute z-50 top-1/2 right-0">
        <localizations.InternalNavigation />
      </div>
      <localizations.SlidePanel />
      <div className="h-full w-full">
        <div className="w-full h-full" id="googleMaps" />
      </div>
    </MapTemplate>
  )
}

function createNewVehicleMarker(
  map: google.maps.Map,
  google: any,
  vehicle: vehicle
) {
  const marker = new google.maps.Marker({
    map,
    zIndex: 2,
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
    <p><b>Última atualização:</b> ${vehicle.date_rastreador}</p>
    <p><b>Placa:</b> ${vehicle.placa}</p>
    <p><b>Velocidade:</b> ${Math.floor(Number(vehicle.speed))} Km/H</p>
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
}

function setVehicleColor(vehicle: vehicle) {
  if (vehicle.ligado) {
    if (Number(vehicle.speed).toFixed() === '0') return '#22ade4'

    return '#009933'
  }

  return '#818181'
}

function centerMapInVehicle(
  coords: { lat: number; lng: number } | undefined,
  map: google.maps.Map | undefined
) {
  if (map && coords) {
    map.setCenter(coords)
    map.setZoom(19)
  }
}
