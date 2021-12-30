import xml2js from 'xml2js'
import { $, useTypedClientMutation } from '../../graphql/generated/zeus/apollo'

const parser = new xml2js.Parser({ attrkey: 'ATTR' })

export async function handlerCriaVeiculo(placa: string) {
  const dadosDaPessoa = await buscaDadosDePessoaFisicaNaApi(placa)
  const dadosConvertidos = converteXmlParaJs(await dadosDaPessoa.text())
  return dadosConvertidos
}

export function insereVeiculo(placa: string, dadosDaApi: unknown) {
  const veiculoCadastrado = useTypedClientMutation(
    {
      insert_clientes_Veiculos_one: [
        {
          object: {
            Cliente_Id: '2edee6aa-29c7-4dca-ac65-fb85f496dc19',
            Categoria_Id: 'passeio',
            Placa: $`Placa`
            // DadosDaApi: $`dadosDaApi`
          }
        },
        {
          Placa: true
        }
      ]
    },
    {
      Placa: placa
    }
  )
  return veiculoCadastrado
}

const buscaDadosDePessoaFisicaNaApi = async (placa: string) => {
  const dadosDaApi = await fetch(
    `https://datacast.info/WSCOD578/WSCODF483.asmx`,
    {
      method: 'POST',
      body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xmlns:xsd="http://www.w3.org/2001/XMLSchema"
              xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
               <soap:Body>
               <consulta xmlns="http://tempuri.org/">
               <placa>${placa}</placa>
               <tipo>${0}</tipo>
               <chassi></chassi>
               <OPCAO>1589</OPCAO>
                <chave>Uk5zcjR0bTEwOlJzQTExdG9ONVYyeg==</chave>
                </consulta>
               </soap:Body>
              </soap:Envelope>`,
      headers: {
        'Content-type': 'text/xml;charset="utf-8"',
        Accept: 'text/xml',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        SOAPAction: 'http://tempuri.org/consulta'
      }
    }
  ).catch((error) => console.log(error))
  return dadosDaApi
}

const converteXmlParaJs = (dadosXml) => {
  let dadosFormatados = [{}]
  parser.parseString(dadosXml, function (error, result) {
    if (error) {
      throw new Error(error)
    }

    const hasResponse =
      result['soap:Envelope']['soap:Body'][0]['consultaResponse'][0][
        'consultaResult'
      ][0]['INFO-XML'][0]['RESPOSTA'].length > 0

    if (hasResponse) {
      dadosFormatados = [
        result['soap:Envelope']['soap:Body'][0]['consultaResponse'][0][
          'consultaResult'
        ][0]['INFO-XML'][0]['RESPOSTA'][0]['VEICULO'],
        result['soap:Envelope']['soap:Body'][0]['consultaResponse'][0][
          'consultaResult'
        ][0]['INFO-XML'][0]['SOLICITACAO']
      ]
    }
  })
  return dadosFormatados
}
