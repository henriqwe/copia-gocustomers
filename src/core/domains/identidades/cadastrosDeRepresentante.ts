import {
  useTypedClientMutation,
  $,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'

export async function insereRepresentanteEPessoa(
  identificador: string,
  tipo: string,
  PessoaRepresentada: string,
  dadosDaApi: unknown
) {
  
  const representante = await useTypedClientMutation(
    {
      insert_identidades_Representantes_one: [
        {
          object: {
            PessoaRepresentada_Id: $`PessoaRepresentada`,
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
      PessoaRepresentada: PessoaRepresentada,
      DadosDaApi: dadosDaApi,
      Nome: dadosDaApi.nome ? dadosDaApi.nome : dadosDaApi.name
    }
  )
  return representante
}

export async function insereRepresentante(
  Pessoa_Id: string,
  PessoaRepresentada: string
) {
  
  const representante = await useTypedClientMutation(
    {
      insert_identidades_Representantes_one: [
        {
          object: {
            Pessoa_Id: $`Pessoa_Id`,
            PessoaRepresentada_Id: $`PessoaRepresentada`
          }
        },
        {
          Id: true
        }
      ]
    },
    {
      Pessoa_Id: Pessoa_Id,
      PessoaRepresentada: PessoaRepresentada
    }
  )
  return representante
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
