import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import * as yup from 'yup'
import { getAllUserVehicles, getVehicleLocationRealTime } from '../api'

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
type LocalizationContextProps = {
  coordsToCenterMap?: { lat: number; lng: number }
  vehicleLocationInfo?: vehicle
  allUserVehicle?: vehicle[]
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  collaboratorsRefetch: () => void
  localizationsLoading: boolean
  localizationsRefetch: () => void
  createLocalizationLoading: boolean
  softDeleteLocalizationLoading: boolean
  updateLocalizationLoading: boolean
  localizationSchema: any
  centerVehicleInMap?: (carroId: number) => void
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: null
  open: boolean
}

export const LocalizationContext = createContext<LocalizationContextProps>(
  {} as LocalizationContextProps
)

export const LocalizationProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const [vehicleLocationInfo, setVehicleLocationInfo] = useState()
  const [allUserVehicle, setAllUserVehicle] = useState<vehicle[]>([])
  const [coordsToCenterMap, setCoordsToCenterMap] = useState({
    lat: -12.100100128939063,
    lng: -49.24919742233473
  })

  const localizationSchema = yup.object().shape({
    Colaborador_Id: yup.object(),
    Cliente_Id: yup.object()
  })
  function centerVehicleInMap(carroId: number) {
    const vehicle = allUserVehicle?.filter((elem: vehicle) => {
      if (elem.carro_id === carroId) return elem
    })

    if (vehicle) {
      setCoordsToCenterMap({
        lat: Number(vehicle[0].latitude),
        lng: Number(vehicle[0].longitude)
      })
    }
  }

  async function updateAllUserVehiclesLocations() {
    let responseGetUserVehicles = await getAllUserVehicles(
      'operacional@radarescolta.com'
    )
    setAllUserVehicle(responseGetUserVehicles)

    setInterval(async () => {
      responseGetUserVehicles = await getAllUserVehicles(
        'operacional@radarescolta.com'
      )
      setAllUserVehicle(responseGetUserVehicles)
    }, 30000)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // const responseGetVehicleLocationRealTime = await getVehicleLocationRealTime(
    //   '285513'
    // )
    // setVehicleLocationInfo(responseGetVehicleLocationRealTime)
    updateAllUserVehiclesLocations()
  }, [])

  return (
    <LocalizationContext.Provider
      value={{
        slidePanelState,
        setSlidePanelState,
        localizationSchema,
        vehicleLocationInfo,
        setVehicleLocationInfo,
        allUserVehicle,
        setAllUserVehicle,
        centerVehicleInMap,
        coordsToCenterMap
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => {
  return useContext(LocalizationContext)
}
