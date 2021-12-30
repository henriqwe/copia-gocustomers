import {
  useTypedClientMutation,
  $,
  useTypedClientQuery
} from 'graphql/generated/zeus/apollo'

export async function insereFornecedorEPessoa(
  identificador: string,
  tipo: string,
  dadosDaApi: any
) {
  const forrnecedor = await useTypedClientMutation(
    {
      insert_identidades_Fornecedores_one: [
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
      Nome: dadosDaApi.nome ? dadosDaApi.nome : dadosDaApi.nomeFantasia
    }
  )
  return forrnecedor
}

export async function insereFornecedor(Pessoa_Id: string) {
  const forrnecedor = await useTypedClientMutation(
    {
      insert_identidades_Fornecedores_one: [
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
  return forrnecedor
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
