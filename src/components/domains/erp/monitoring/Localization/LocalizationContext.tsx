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
import { getAllUserVehicles } from '../api'

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

type coordsToCenterMap = {
  lat?: number
  lng?: number
  carro_id?: number
}
type LocalizationContextProps = {
  setVehicleConsultData?: Dispatch<SetStateAction<vehicle | undefined>>
  vehicleConsultData?: vehicle
  allUserVehicle?: vehicle[]
  coordsToCenterMap?: coordsToCenterMap
  vehicleLocationInfo?: vehicle
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
  vehicleOnFocusId: number | undefined
  setVehicleOnFocusId: Dispatch<SetStateAction<number | undefined>>
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
  const [vehicleConsultData, setVehicleConsultData] = useState<vehicle>()
  const [allUserVehicle, setAllUserVehicle] = useState<vehicle[]>([])
  const [coordsToCenterMap, setCoordsToCenterMap] = useState<coordsToCenterMap>(
    {}
  )
  const [localizationsLoading, setLocalizationsLoading] = useState(false)
  const [vehicleOnFocusId, setVehicleOnFocusId] = useState<number>()
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
        lng: Number(vehicle[0].longitude),
        carro_id: vehicle[0].carro_id
      })
    }
  }
  async function localizationsRefetch() {
    await updateAllUserVehiclesLocations()
  }
  async function updateAllUserVehiclesLocations() {
    setLocalizationsLoading(true)
    const responseGetUserVehicles = await getAllUserVehicles(
      'operacional@radarescolta.com'
    )
    if (responseGetUserVehicles) setAllUserVehicle(responseGetUserVehicles)
    setLocalizationsLoading(false)
  }

  useEffect(() => {
    updateAllUserVehiclesLocations()
    setInterval(async () => {
      updateAllUserVehiclesLocations()
    }, 30000)
  }, [])

  return (
    <LocalizationContext.Provider
      value={{
        localizationsRefetch,
        slidePanelState,
        setSlidePanelState,
        localizationSchema,
        vehicleLocationInfo,
        setVehicleLocationInfo,
        allUserVehicle,
        setAllUserVehicle,
        centerVehicleInMap,
        coordsToCenterMap,
        localizationsLoading,
        vehicleConsultData,
        setVehicleConsultData,
        vehicleOnFocusId,
        setVehicleOnFocusId
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => {
  return useContext(LocalizationContext)
}
