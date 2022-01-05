import axios from 'axios'

export async function getVehicleLocationRealTime(carro_id: string) {
  const { data } = await axios.post(
    'https://integration.chaser.com.br/mobile/api/veiculo/localizacao/temporeal',
    {
      carro_id
    }
  )
  return data
}

export async function getAllUserVehicles(email: string) {
  const { data } = await axios.post(
    'https://integration.chaser.com.br/mobile/api/veiculo/usuario',
    {
      email
    }
  )
  return data
}

export async function getVehicleHistoric(
  carro_id: string,
  inicio: string,
  fim: string
) {
  const { data } = await axios.post(
    'https://integration.chaser.com.br/mobile/api/veiculo/usuario',
    {
      carro_id,
      inicio,
      fim
    }
  )
  return data
}
