import axios from 'axios'
import { showError } from 'utils/showError'

export async function getVehicleLocationRealTime(carro_id: string) {
  try {
    const { data } = await axios.post(
      'https://integration.chaser.com.br/mobile/api/veiculo/localizacao/temporeal',
      {
        carro_id
      }
    )
    return data
  } catch (err: any) {
    showError(err)
  }
}

export async function getAllUserVehicles(email: string) {
  try {
    const { data } = await axios.post(
      'https://integration.chaser.com.br/mobile/api/veiculo/usuario',
      {
        email
      }
    )
    return data
  } catch (err: any) {
    showError(err)
  }
}

export async function getVehicleHistoric(
  carro_id: string,
  inicio: string,
  fim: string
) {
  try {
    const { data } = await axios.post(
      'https://integration.chaser.com.br/mobile/api/veiculo/usuario',
      {
        carro_id,
        inicio,
        fim
      }
    )
    return data
  } catch (err: any) {
    showError(err)
  }
}
