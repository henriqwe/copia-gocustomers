import { v4 as uuidv4 } from 'uuid'
import xml2js from 'xml2js'
const parser = new xml2js.Parser({ attrkey: 'ATTR' })

export async function handlerCriaPessoa(
  identificador: string,
  pessoaJuridica: string
) {
  if (!pessoaJuridica) {
    return cadastraPessoaFisica(identificador)
  }
  return cadastraPessoaJuridica(identificador)
}

const cadastraPessoaFisica = async (identificador: string) => {
  const dadosDaPessoa = await buscaDadosDePessoaFisicaNaApi(identificador)
  const dadosConvertidos = converteXmlParaJs(await dadosDaPessoa.text())
  console.log('converteXmlParaJs')
  const dadosFormatadosParaInsercao =
    formataDadosDaPessoaFisicaParaInsercaoNobanco(dadosConvertidos)
  console.log('formataDadosDaPessoaFisicaParaInsercaoNobanco')
  return dadosFormatadosParaInsercao
}
const cadastraPessoaJuridica = async (identificador: string) => {
  const dadosDaPessoa = await buscaDadosDePessoaJuridicaNaApi(identificador)
  dadosDaPessoa.founded = new Date(dadosDaPessoa.founded)
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '')
  // const dadosFormatadosParaInsercao =
  //   formataDadosDaPessoaJuridicaParaInsercaoNobanco(dadosDaPessoa)
  return dadosDaPessoa
}

const buscaDadosDePessoaJuridicaNaApi = async (identificador: string) => {
  const resposta = await fetch(
    `https://api.cnpja.com.br/companies/${identificador}`,
    {
      method: 'GET',
      headers: {
        authorization:
          '4c90473c-c84b-4277-96ed-3f49246db41b-d8ef7463-b4d2-4838-b26d-1cb7d2b45c98'
      }
    }
  )
  const dadosDaApi = await resposta.json()
  return dadosDaApi
}

const buscaDadosDePessoaFisicaNaApi = async (identificador: string) => {
  const dadosDaApi = await fetch(
    `http://datacast3.com/WebService/servico.asmx?op=LocalizaPF`,
    {
      method: 'POST',
      body: `<?xml version="1.0" encoding="utf-8"?>
                  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <LocalizaPF xmlns="http://tempuri.org/">
                          <dado>${identificador}</dado>
                          <tipo>CPF</tipo>
                          <chave>Uk5zcjR0bTEwOlJzQTExdG9ONVYyeg==</chave>
                        </LocalizaPF>
                     </soap:Body>
                   </soap:Envelope>`,
      headers: {
        'Content-type': 'text/xml;charset="utf-8"',
        Accept: 'text/xml',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        SOAPAction: 'http://tempuri.org/LocalizaPF'
        // 'Content-length': strlen($soap_request),
      }
    }
  )
  return dadosDaApi
}

// const formataDadosDaPessoaJuridicaParaInsercaoNobanco = (dadosFormatados) => {
//   const nomeFantasia = dadosFormatados.alias
//   const razaoSocial = dadosFormatados.name
//   const dateFounded = new Date(dadosFormatados.founded)
//   const dataDeNascimento = dateFounded
//     .toISOString()
//     .replace('T', ' ')
//     .replace('Z', '')
//   const emails = [
//     {
//       id: uuidv4(),
//       email: dadosFormatados.email,
//       categorias: ['5'],
//       responsavel: ''
//     }
//   ]
//   const telefones = [
//     {
//       id: uuidv4(),
//       telefone: dadosFormatados.phone
//         ? dadosFormatados.phone
//             .replace(' ', '')
//             .replace('(', '')
//             .replace(')', '')
//             .replace('-', '')
//         : null,
//       whatsapp: '0',
//       categorias: ['5'],
//       responsavel: ''
//     }
//   ]
//   const enderecos = [
//     {
//       id: uuidv4(),
//       cep: dadosFormatados.address.zip,
//       bairro: dadosFormatados.address.neighborhood,
//       cidade: dadosFormatados.address.city,
//       estado: dadosFormatados.address.state,
//       numero: dadosFormatados.address.number,
//       categorias: ['5'],
//       logradouro: dadosFormatados.address.street,
//       complemento: dadosFormatados.address.details,
//       pontoDeReferencia: ''
//     }
//   ]
//   return {
//     nomeFantasia,
//     razaoSocial,
//     emails,
//     telefones,
//     enderecos,
//     dataDeNascimento
//   }
// }

const formataDadosDaPessoaFisicaParaInsercaoNobanco = (dadosDePessoaFisica) => {
  const telefones = []
  dadosDePessoaFisica[0][0].TELEFONES[0] !== '' &&
    telefones.push(...dadosDePessoaFisica[0][0].TELEFONES[0].TELEFONE)
  dadosDePessoaFisica[0][0].CELULARES[0] !== '' &&
    telefones.push(...dadosDePessoaFisica[0][0].CELULARES[0].CELULAR)
  const emails =
    dadosDePessoaFisica[0][0].EMAILS !== ''
      ? dadosDePessoaFisica[0][0].EMAILS[0].EMAIL
      : []
  const enderecos =
    dadosDePessoaFisica[0][0].ENDERECOS !== ''
      ? dadosDePessoaFisica[0][0].ENDERECOS[0].LOCALIZACAO
      : []
  const dadosGerais = dadosDePessoaFisica[0][0].CADASTRO[0]

  const nome = dadosGerais.NOME[0]
  const sexo = dadosGerais.SEXO[0] === 'M' ? '2' : '1'
  const dataNascimento = formataanoMesDia(dadosGerais.DATA_DE_NASCIMENTO[0])
  const outros = {
    renda: dadosGerais.RENDA[0],
    nome_da_mae: dadosGerais.NOME_DA_MAE[0],
    ocupacao: dadosGerais.OCUPACAO[0],
    situacao_do_cpf: dadosGerais.SITUACAO_DO_CPF[0]
  }
  return {
    nome,
    sexo,
    dataNascimento,
    outros,
    telefones: formataTelefonesParaInsercao(telefones),
    emails: formataEmailsParaInsercao(emails),
    enderecos: formataEndeercosParaInsercao(enderecos)
  }
}

const formataEmailsParaInsercao = (emails) => {
  return emails.map((email) => {
    return {
      id: uuidv4(),
      email: email.toLowerCase(),
      categorias: ['5'],
      responsavel: ''
    }
  })
}
const formataTelefonesParaInsercao = (telefones) => {
  return telefones.map((telefone) => {
    return {
      id: uuidv4(),
      telefone: telefone.DDD[0] + telefone.NUMERO[0],
      whatsapp: telefone.WHATSAPP[0] === 'SIM' ? '1' : '0',
      categorias: ['5'],
      responsavel: ''
    }
  })
}

const formataEndeercosParaInsercao = (enderecos) => {
  return enderecos.map((endereco) => {
    return {
      id: uuidv4(),
      cep: endereco.CEP[0],
      bairro: endereco.BAIRRO[0],
      cidade: endereco.CIDADE[0],
      estado: endereco.UF[0],
      numero: '',
      categorias: ['5'],
      logradouro: endereco.ENDERECO[0],
      complemento: '',
      pontoDeReferencia: ''
    }
  })
}

const converteXmlParaJs = (dadosXml) => {
  let dadosFormatados = [{}]
  parser.parseString(dadosXml, function (error, result) {
    if (error) {
      throw new Error(error)
    }
    const hasResponse =
      result['soap:Envelope']['soap:Body'][0]['LocalizaPFResponse'][0][
        'LocalizaPFResult'
      ][0]['INFO-XML'][0]['RESPOSTA'].length > 0

    if (hasResponse) {
      dadosFormatados = [
        result['soap:Envelope']['soap:Body'][0]['LocalizaPFResponse'][0][
          'LocalizaPFResult'
        ][0]['INFO-XML'][0]['RESPOSTA'][0]['INFOCAR_LOCALIZA_PF'][0][
          'DADOS_CADASTRAIS'
        ],
        result['soap:Envelope']['soap:Body'][0]['LocalizaPFResponse'][0][
          'LocalizaPFResult'
        ][0]['INFO-XML'][0]['SOLICITACAO']
      ]
    }
  })
  return dadosFormatados
}

const formataanoMesDia = (anoMesDia: string) => {
  const anoMesDiaDividido = anoMesDia.split('/')
  const newDate = new Date(
    `${anoMesDiaDividido[1]}/${anoMesDiaDividido[0]}/${anoMesDiaDividido[2]}`
  )
  return newDate.toISOString().replace('T', ' ').replace('Z', '')
}
