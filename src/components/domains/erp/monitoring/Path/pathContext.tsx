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
import { getVehicleHistoric, getAllUserVehicles } from '../api'

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
type PathContextProps = {
  setVehicleConsultData?: Dispatch<SetStateAction<vehicle | undefined>>
  vehicleConsultData?: vehicle[]
  allUserVehicle?: vehicle[]
  coordsToCenterMap?: coordsToCenterMap
  vehicleLocationInfo?: vehicle
  vehicleHistoric?: vehicle | undefined
  slidePanelState: SlidePanelStateType
  setSlidePanelState: Dispatch<SetStateAction<SlidePanelStateType>>
  collaboratorsRefetch: () => void
  pathsLoading: boolean
  pathsRefetch: () => void
  createPathLoading: boolean
  softDeletePathLoading: boolean
  updatePathLoading: boolean
  pathSchema: any
  coordsToCenterPointInMap: coordsToCenterMap
  setCoordsToCenterPointInMap: Dispatch<SetStateAction<coordsToCenterMap>>
  centerVehicleInMap?: (carroId: number) => void
  consultVehicleHistoric?: (
    carro_id: string,
    inicio: string,
    fim: string
  ) => void
}

type ProviderProps = {
  children: ReactNode
}

type SlidePanelStateType = {
  type: 'create' | 'update'
  data?: null
  open: boolean
}

export const PathContext = createContext<PathContextProps>(
  {} as PathContextProps
)

export const PathProvider = ({ children }: ProviderProps) => {
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelStateType>({
    type: 'create',
    open: false
  })
  const [vehicleLocationInfo, setVehicleLocationInfo] = useState()
  const [vehicleConsultData, setVehicleConsultData] = useState<vehicle[]>()
  const [vehicleHistoric, setVehicleHistoric] = useState<vehicle>()
  const [coordsToCenterMap, setCoordsToCenterMap] = useState<coordsToCenterMap>(
    {}
  )
  const [coordsToCenterPointInMap, setCoordsToCenterPointInMap] =
    useState<coordsToCenterMap>({})
  const [allUserVehicle, setAllUserVehicle] = useState<vehicle[]>([])

  const [pathsLoading, setPathsLoading] = useState(false)

  const pathSchema = yup.object().shape({
    Colaborador_Id: yup.object(),
    Cliente_Id: yup.object()
  })
  function centerVehicleInMap(carroId: number) {
    const vehicle = vehicleHistoric?.filter((elem: vehicle) => {
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
  async function pathsRefetch() {
    return
  }
  async function updateAllUserVehiclesLocations() {
    const responseGetUserVehicles = await getAllUserVehicles(
      'operacional@radarescolta.com'
    )
    if (responseGetUserVehicles) setAllUserVehicle(responseGetUserVehicles)
  }
  async function consultVehicleHistoric(
    carro_id: string,
    inicio: string,
    fim: string
  ) {
    setPathsLoading(true)
    const response = await getVehicleHistoric(carro_id, inicio, fim)
    setVehicleConsultData(response)
    setPathsLoading(false)
  }

  useEffect(() => {
    updateAllUserVehiclesLocations()
  }, [])

  return (
    <PathContext.Provider
      value={{
        pathsRefetch,
        slidePanelState,
        setSlidePanelState,
        pathSchema,
        vehicleLocationInfo,
        setVehicleLocationInfo,
        vehicleHistoric,
        setVehicleHistoric,
        centerVehicleInMap,
        coordsToCenterMap,
        pathsLoading,
        vehicleConsultData,
        setVehicleConsultData,
        consultVehicleHistoric,
        allUserVehicle,
        coordsToCenterPointInMap,
        setCoordsToCenterPointInMap
      }}
    >
      {children}
    </PathContext.Provider>
  )
}

export const usePath = () => {
  return useContext(PathContext)
}
