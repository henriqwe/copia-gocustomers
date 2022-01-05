import rotas from '@/domains/routes'
import Base from '@/templates/Base'

import { Loader } from '@googlemaps/js-api-loader'
import { useEffect } from 'react'

type locationProps = {
  lat: number | undefined
  lng: number | undefined
  velocity: number | undefined
  engineRunning: boolean | undefined
}
type timerProps = {
  cancel?: (() => void) | undefined
  pause?: (() => void | undefined) | undefined
  resume?: (() => void | undefined) | undefined
  timeoutCallback?: (() => void) | undefined
}
export default function Trajetos() {
  return <Page />
}

export function Page() {
  const pathCoordsCar1 = [
    {
      //a
      lat: -5.884947333509144,
      lng: -35.24594699140512,
      velocity: 20,
      engineRunning: true
    },
    {
      //b
      lat: -5.8862443458657525,
      lng: -35.24971282416306,
      velocity: 35,
      engineRunning: true
    },
    {
      //c
      lat: -5.890377103437126,
      lng: -35.250307146900525,
      velocity: 40,
      engineRunning: true
    },
    {
      //d
      lat: -5.8912789026834576,
      lng: -35.25429827396411,
      velocity: 45,
      engineRunning: true
    },
    {
      //e
      lat: -5.8912575583410804,
      lng: -35.25862199464405,
      velocity: 40,
      engineRunning: true
    },
    {
      //f
      lat: -5.8947366753373425,
      lng: -35.25784951851657,
      velocity: 47,
      engineRunning: true
    },
    {
      //g
      lat: -5.8984187316483805,
      lng: -35.258721173093186,
      velocity: 38,
      engineRunning: true
    },
    {
      //h
      lat: -5.903303388787477,
      lng: -35.259807721749056,
      velocity: 40,
      engineRunning: true
    },
    {
      //i
      lat: -5.908957265850644,
      lng: -35.261083602587675,
      velocity: 37,
      engineRunning: true
    },
    {
      //j
      lat: -5.91249749638632,
      lng: -35.26192445763266,
      velocity: 40,
      engineRunning: true
    },
    {
      //k
      lat: -5.91249749638622,
      lng: -35.26192445763266,
      velocity: 17,
      engineRunning: true
    }
  ]
  const addicionalPathCoordsCar1 = [
    [
      {
        //k
        lat: -5.91249749638632,
        lng: -35.26192445763266,
        velocity: 25,
        engineRunning: true
      }
    ],
    [
      {
        //n
        lat: -5.908957265850644,
        lng: -35.261083602587675,
        velocity: 46,
        engineRunning: true
      }
    ],
    [
      {
        //m
        lat: -5.903303388787477,
        lng: -35.259807721749056,
        velocity: 52,
        engineRunning: true
      }
    ],
    [
      {
        //l
        lat: -5.8984187316483805,
        lng: -35.258721173093186,
        velocity: 36,
        engineRunning: true
      }
    ],
    [
      {
        //o
        lat: -5.8947366753373425,
        lng: -35.25784951851657,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        //p
        lat: -5.89481008129484,
        lng: -35.25697427589889,
        velocity: 30,
        engineRunning: true
      }
    ],
    [
      {
        //q
        lat: -5.895776008962363,
        lng: -35.254759037549285,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],

    [
      {
        //r
        lat: -5.892606552511114,
        lng: -35.25208861323744,
        velocity: 30,
        engineRunning: true
      },
      {
        //s
        lat: -5.890644498972446,
        lng: -35.251329969967024,
        velocity: 36,
        engineRunning: true
      },
      {
        //t
        lat: -5.890523756870614,
        lng: -35.24990372060674,
        velocity: 42,
        engineRunning: true
      },
      {
        //u
        lat: -5.889557820068792,
        lng: -35.248052631027825,
        velocity: 47,
        engineRunning: true
      },
      {
        //v
        lat: -5.885739334647034,
        lng: -35.24753675360669,
        velocity: 43,
        engineRunning: true
      },
      {
        //w
        lat: -5.8853921983517825,
        lng: -35.24614084998638,
        velocity: 21,
        engineRunning: true
      }
    ],
    [
      {
        //x
        lat: -5.884999783102432,
        lng: -35.2461711957172,
        velocity: 43,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.885497848505855,
        lng: -35.24615602284569,
        velocity: 36,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.884622460428009,
        lng: -35.241846929069744,
        velocity: 50,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.887218434872401,
        lng: -35.24221107783692,
        velocity: 17,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.888742809565211,
        lng: -35.24274212812101,
        velocity: 20,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.888742809565211,
        lng: -35.24274212812101,
        velocity: 0,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.887484626800578,
        lng: -35.2357260760468,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.886393156009047,
        lng: -35.229448742446394,
        velocity: 50,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.886393156009046,
        lng: -35.229448742446394,
        velocity: 35,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.885200150598786,
        lng: -35.22924460151629,
        velocity: 0,
        engineRunning: false
      }
    ]
  ]
  const pathCoordsCar2 = [
    {
      //a
      lat: -5.869267795206282,
      lng: -35.24285859455655,
      velocity: 20,
      engineRunning: true
    },
    {
      //b
      lat: -5.872853775000709,
      lng: -35.24466103890948,
      velocity: 35,
      engineRunning: true
    },
    {
      //c
      lat: -5.877506976270129,
      lng: -35.243716901391274,
      velocity: 40,
      engineRunning: true
    },
    {
      //d
      lat: -5.879598769672266,
      lng: -35.242300695113975,
      velocity: 45,
      engineRunning: true
    },
    {
      //e
      lat: -5.8830343095492434,
      lng: -35.241597498139555,
      velocity: 40,
      engineRunning: true
    },
    {
      //f
      lat: -5.885617968026447,
      lng: -35.24200028772182,
      velocity: 47,
      engineRunning: true
    },
    {
      //g
      lat: -5.888563509504932,
      lng: -35.24264401787538,
      velocity: 38,
      engineRunning: true
    },
    {
      //h
      lat: -5.888563509504932,
      lng: -35.24264401787538,
      velocity: 40,
      engineRunning: true
    },
    {
      //i
      lat: -5.889417286702043,
      lng: -35.24616307589777,
      velocity: 37,
      engineRunning: true
    },
    {
      //j
      lat: -5.89005761873867,
      lng: -35.24903840379411,
      velocity: 40,
      engineRunning: true
    },
    {
      //k
      lat: -5.89108214846162,
      lng: -35.25431699082768,
      velocity: 17,
      engineRunning: true
    }
  ]
  const addicionalPathCoordsCar2 = [
    [
      {
        //n
        lat: -5.891022018144565,
        lng: -35.260428034463885,
        velocity: 46,
        engineRunning: true
      }
    ],
    [
      {
        //m
        lat: -5.890086267728317,
        lng: -35.263720546077614,
        velocity: 52,
        engineRunning: true
      }
    ],
    [
      {
        //l
        lat: -5.889346721929082,
        lng: -35.266527526024795,
        velocity: 36,
        engineRunning: true
      }
    ],
    [
      {
        //o
        lat: -5.888199669369837,
        lng: -35.2708517928952,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        //p
        lat: -5.887414842533102,
        lng: -35.27376498307313,
        velocity: 30,
        engineRunning: true
      }
    ],
    [
      {
        //q
        lat: -5.8861772287451375,
        lng: -35.276010567170616,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        //x
        lat: -5.8854527706300885,
        lng: -35.27667817321211,
        velocity: 0,
        engineRunning: false
      }
    ]
  ]

  const pathCoordsCar3 = [
    {
      //a
      lat: -5.884947333509144,
      lng: -35.24594699140512,
      velocity: 20,
      engineRunning: true
    },
    {
      //b
      lat: -5.8862443458657525,
      lng: -35.24971282416306,
      velocity: 35,
      engineRunning: true
    },
    {
      //c
      lat: -5.890377103437126,
      lng: -35.250307146900525,
      velocity: 40,
      engineRunning: true
    },
    {
      //d
      lat: -5.8912789026834576,
      lng: -35.25429827396411,
      velocity: 45,
      engineRunning: true
    },
    {
      //e
      lat: -5.8912575583410804,
      lng: -35.25862199464405,
      velocity: 40,
      engineRunning: true
    },
    {
      //f
      lat: -5.8947366753373425,
      lng: -35.25784951851657,
      velocity: 47,
      engineRunning: true
    },
    {
      //g
      lat: -5.8984187316483805,
      lng: -35.258721173093186,
      velocity: 38,
      engineRunning: true
    },
    {
      //h
      lat: -5.903303388787477,
      lng: -35.259807721749056,
      velocity: 40,
      engineRunning: true
    },
    {
      //i
      lat: -5.908957265850644,
      lng: -35.261083602587675,
      velocity: 37,
      engineRunning: true
    },
    {
      //j
      lat: -5.91249749638632,
      lng: -35.26192445763266,
      velocity: 40,
      engineRunning: true
    },
    {
      //k
      lat: -5.91249749638622,
      lng: -35.26192445763266,
      velocity: 17,
      engineRunning: true
    }
  ]
  const addicionalPathCoordsCar3 = [
    [
      {
        //k
        lat: -5.91249749638632,
        lng: -35.26192445763266,
        velocity: 25,
        engineRunning: true
      }
    ],
    [
      {
        //n
        lat: -5.908957265850644,
        lng: -35.261083602587675,
        velocity: 46,
        engineRunning: true
      }
    ],
    [
      {
        //m
        lat: -5.903303388787477,
        lng: -35.259807721749056,
        velocity: 52,
        engineRunning: true
      }
    ],
    [
      {
        //l
        lat: -5.8984187316483805,
        lng: -35.258721173093186,
        velocity: 36,
        engineRunning: true
      }
    ],
    [
      {
        //o
        lat: -5.8947366753373425,
        lng: -35.25784951851657,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        //p
        lat: -5.89481008129484,
        lng: -35.25697427589889,
        velocity: 30,
        engineRunning: true
      }
    ],
    [
      {
        //q
        lat: -5.895776008962363,
        lng: -35.254759037549285,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],
    [
      {
        lat: undefined,
        lng: undefined,
        velocity: undefined,
        engineRunning: undefined
      }
    ],

    [
      {
        //r
        lat: -5.892606552511114,
        lng: -35.25208861323744,
        velocity: 30,
        engineRunning: true
      },
      {
        //s
        lat: -5.890644498972446,
        lng: -35.251329969967024,
        velocity: 36,
        engineRunning: true
      },
      {
        //t
        lat: -5.890523756870614,
        lng: -35.24990372060674,
        velocity: 42,
        engineRunning: true
      },
      {
        //u
        lat: -5.889557820068792,
        lng: -35.248052631027825,
        velocity: 47,
        engineRunning: true
      },
      {
        //v
        lat: -5.885739334647034,
        lng: -35.24753675360669,
        velocity: 43,
        engineRunning: true
      },
      {
        //w
        lat: -5.8853921983517825,
        lng: -35.24614084998638,
        velocity: 21,
        engineRunning: true
      }
    ],
    [
      {
        //x
        lat: -5.884999783102432,
        lng: -35.2461711957172,
        velocity: 43,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.885497848505855,
        lng: -35.24615602284569,
        velocity: 36,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.884622460428009,
        lng: -35.241846929069744,
        velocity: 50,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.887218434872401,
        lng: -35.24221107783692,
        velocity: 17,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.888742809565211,
        lng: -35.24274212812101,
        velocity: 20,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.888742809565211,
        lng: -35.24274212812101,
        velocity: 0,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.887484626800578,
        lng: -35.2357260760468,
        velocity: 40,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.886393156009047,
        lng: -35.229448742446394,
        velocity: 50,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.886393156009046,
        lng: -35.229448742446394,
        velocity: 35,
        engineRunning: true
      }
    ],
    [
      {
        lat: -5.885200150598786,
        lng: -35.22924460151629,
        velocity: 0,
        engineRunning: false
      }
    ]
  ]

  function initMap(pathCoordsCar1: locationProps[]) {
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
      .then((google) => {
        const map = new google.maps.Map(
          document.getElementById('googleMap') as HTMLElement,
          {
            center: {
              lat: pathCoordsCar1[0].lat,
              lng: pathCoordsCar1[0].lng
            },
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
        )
        map.setOptions({ styles })

        createNewCarMarker(
          map,
          google,
          pathCoordsCar1,
          addicionalPathCoordsCar1,
          5
        )
        createNewCarMarker(
          map,
          google,
          pathCoordsCar2,
          addicionalPathCoordsCar2,
          0
        )
        createNewCarMarker(
          map,
          google,
          pathCoordsCar3,
          addicionalPathCoordsCar3,
          0
        )
      })
      .catch((e) => {
        console.log('error: ', e)
      })
  }

  useEffect(() => {
    initMap(pathCoordsCar1)
  }, [])

  return (
    <Base
      title="Trajetos"
      noGrid={true}
      currentLocation={[
        { title: 'Dashboard', url: rotas.erp.home },
        { title: 'Trajetos', url: rotas.erp.monitoramento.trajetos }
      ]}
    >
      <div className="w-full h-full mb-2 z-10" id="googleMap"></div>
    </Base>
  )
}
function createNewCarMarker(
  map: google.maps.Map,
  google: any,
  pathCoords: locationProps[],
  addicionalPathCoords: locationProps[] | locationProps[][],
  currentPos: number
) {
  let showRoute = false
  let noConection = false
  let timer: timerProps
  let markerWhitInfo: google.maps.Marker[] = []
  const marker = new google.maps.Marker({
    map,
    zIndex: 2,
    icon: {
      path: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
      scale: 0.5,
      strokeWeight: 0.7,
      fillColor: '#009933',
      fillOpacity: 1,
      anchor: new google.maps.Point(10, 25),
      rotation: 0
    }
  })
  const line = new google.maps.Polyline({
    path: [],
    strokeColor: '#4da9d8',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    geodesic: true, //set to false if you want straight line instead of arc
    map
  })

  marker.addListener('click', () => {
    showRoute = !showRoute
    if (showRoute) {
      renderPolylineToInitialPos(currentPos)
      return
    }
    line.getPath().clear()
    removeMarkersWhitInfo()
    return
  })

  function InvervalTimer(
    callback: (arg: null) => void,
    interval: number,
    arg = null
  ) {
    let timerId: any,
      startTime: Date,
      remaining = 0
    let state = 1 //  0 = idle, 1 = running, 2 = paused, 3= resumed
    let timeoutId: any
    const pause = function () {
      if (state != 1) return

      remaining = interval - (new Date() - startTime)
      window.clearInterval(timerId)
      state = 2
    }

    const resume = function () {
      if (state != 2) return

      state = 3
      timeoutId = window.setTimeout(timeoutCallback, remaining, arg)
    }

    const timeoutCallback = function (timer) {
      if (state != 3) return
      clearTimeout(timeoutId)
      startTime = new Date()
      timerId = window.setInterval(function () {
        callback(arg)
      }, interval)
      state = 1
    }

    const cancel = function () {
      clearInterval(timerId)
    }
    startTime = new Date()
    timerId = window.setInterval(function () {
      callback(arg)
    }, interval)
    state = 1
    return {
      cancel: cancel,
      pause: pause,
      resume: resume,
      timeoutCallback: timeoutCallback
    }
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
    const timePerStep = 25 //Change this to alter animation speed
    timer = InvervalTimer(function () {
      step += 1
      if (step > numSteps) {
        step = 0
        if (currentPos < pathCoords.length - 4) {
          if (showRoute) {
            createMarkerWhitInfo(
              pathCoords[currentPos + 1],
              pathCoords[currentPos]
            )
          }
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
        if (showRoute) {
          line.getPath().push(are_we_there_yet)
        }

        moveMarker(marker, departure, are_we_there_yet)
        return
      }
    }, timePerStep)
  }
  function renderPolylineToInitialPos(index: number) {
    line.getPath().clear()
    const paths = pathCoords.slice(0, index + 1)
    paths.forEach((path, index) => {
      createMarkerWhitInfo(path, paths[index - 1])
      const arrival = new google.maps.LatLng(path.lat, path.lng)
      line.getPath().push(arrival)
    })
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

  function createMarkerWhitInfo(
    position: locationProps,
    previousPosition: locationProps
  ) {
    const infowindow = new google.maps.InfoWindow({
      content: `<div class='text-dark-7'>
      <p><b>Velocidade:</b> ${position.velocity}Km/H</p>
      <p><b>Motor:</b> ${position.engineRunning ? 'Ligado' : 'Desligado'}</p>
      </div> `
    })

    const markerlocal = new google.maps.Marker({
      position,
      map,
      zIndex: 1,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeWeight: 0,
        fillColor:
          previousPosition === undefined
            ? '#000'
            : position.lat !== previousPosition.lat &&
              position.lng !== previousPosition.lng
            ? '#000'
            : '#2600ff',
        fillOpacity: 1
      }
    })
    markerlocal.addListener('mouseover', () => {
      infowindow.open({
        anchor: markerlocal,
        map,
        shouldFocus: false
      })
    })
    markerlocal.addListener('mouseout', () => {
      infowindow.close()
    })
    markerWhitInfo.push(markerlocal)
  }
  function removeMarkersWhitInfo() {
    if (markerWhitInfo) {
      markerWhitInfo.forEach((maker) => {
        maker.setMap(null)
      })
      markerWhitInfo = []
    }
  }

  recursiveAnimate()

  setInterval(() => {
    if (addicionalPathCoords.length > 0) {
      addPathCoords()
    }
    if (addicionalPathCoords.length === 1) {
      addicionalPathCoords.push(addicionalPathCoords[0])
    }
    if (noConection && currentPos < pathCoords.length - 5) {
      noConection = false
      line.getPath().clear()
      if (pathCoords.length - currentPos > 6) {
        currentPos = pathCoords.length - 6
      }
      if (showRoute) {
        renderPolylineToInitialPos(currentPos)
      }
      recursiveAnimate()
    }
  }, 1000)
}
