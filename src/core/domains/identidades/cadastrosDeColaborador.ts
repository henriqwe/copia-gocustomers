import {
  useTypedClientMutation,
  $,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'

export async function insereColaboradorEPessoa(
  identificador: string,
  tipo: string,
  dadosDaApi: any
) {
  const colaborador = await useTypedClientMutation(
    {
      insert_identidades_Colaboradores_one: [
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
  return colaborador
}

export async function insereColaborador(Pessoa_Id: string) {
  const colaborador = await useTypedClientMutation(
    {
      insert_identidades_Colaboradores_one: [
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
  return colaborador
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
