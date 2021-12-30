import {
  useTypedClientMutation,
  $,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'

export async function insereClienteEPessoa(
  identificador: string,
  tipo: string,
  dadosDaApi: unknown
) {
  
  const cliente = await useTypedClientMutation(
    {
      insert_identidades_Clientes_one: [
        {
          object: {
            Pessoa: {
              data: {
                Nome: $`Nome`,
                Identificador: $`Identificador`,
                PessoaJuridica: $`PessoaJuridica`,
                DadosDaApi: $`DadosDaApi`
              }
            }
          }
        },
        {
          Id: true
        }
      ]
    },
    {
      Identificador: identificador,
      PessoaJuridica: tipo,
      DadosDaApi: dadosDaApi,
      Nome: dadosDaApi.nome ? dadosDaApi.nome : dadosDaApi.name
    }
  )
  return cliente
}

export async function insereCliente(Pessoa_Id: string) {
  
  const cliente = await useTypedClientMutation(
    {
      insert_identidades_Clientes_one: [
        {
          object: {
            Pessoa_Id: $`Pessoa_Id`
          }
        },
        {
          Id: true
        }
      ]
    },
    {
      Pessoa_Id: Pessoa_Id
    }
  )
  return cliente
}

export async function BuscarPessoaExistente(Identificador: string) {
  const { data } = await useTypedClientQuery({
    identidades_Pessoas: [
      { where: { Identificador: { _eq: Identificador } } },
      {
        Id: true
      }
    ]
  })
  return data
}
