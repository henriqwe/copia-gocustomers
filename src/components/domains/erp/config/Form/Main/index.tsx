import { useForm, Controller } from 'react-hook-form'

import * as common from '@/common'
import * as buttons from '@/common/Buttons'
import * as form from '@/common/Form'
import * as families from '@/domains/erp/inventory/Registration/Families'
import * as config from '@/domains/erp/config'
import { notification } from 'utils/notification'
import { showError } from 'utils/showError'
import { useEffect } from 'react'

type FormData = {
  Chips: Select
  Equipamentos: Select
  Identificadores: Select
  Rastreadores: Select
  KitsDeInsumo: Select
  KitsDeInstalacao: Select
}

type Select = {
  key: string
  title: string
}

const Main = () => {
  const { parentsFamiliesData } = families.useFamily()
  const { configData, configRefetch, updateConfig, updateConfigLoading } =
    config.useConfig()
  const { control, handleSubmit, reset } = useForm()

  async function onSubmit(data: FormData) {
    let pass = false
    for (let i = 0; i < configData!.length; i++) {
      let Valor: any[] = []
      switch (configData?.[i].Slug as string) {
        case 'familiaChips':
          Valor = [data.Chips.key, data.Chips.title]
          break
        case 'familiaEquipamentos':
          Valor = [data.Equipamentos.key, data.Equipamentos.title]
          break
        case 'familiaIdentificadores':
          Valor = [data.Identificadores.key, data.Identificadores.title]
          break
        case 'familiaRastreadores':
          Valor = [data.Rastreadores.key, data.Rastreadores.title]
          break
        case 'familiaKitsDeInsumo':
          Valor = [data.KitsDeInsumo.key, data.KitsDeInsumo.title]
          break
        case 'familiaKitsDeInstalacao':
          Valor = [data.KitsDeInstalacao.key, data.KitsDeInstalacao.title]
          break
      }
      if (!Valor.includes(undefined)) {
        await updateConfig({
          variables: {
            Slug: configData?.[i].Slug,
            Valor
          }
        })
          .then(() => {
            pass = true
          })
          .catch((err) => {
            showError(err)
            return
          })
      }
    }
    if (pass) {
      configRefetch()
      notification('Configurações salvas com sucesso', 'success')
    }
  }

  useEffect(() => {
    if (configData?.length !== 0 && configData !== undefined) {
      const chips = configData?.filter(
        (config) => config.Slug === 'familiaChips'
      )

      const equipamentos = configData?.filter(
        (config) => config.Slug === 'familiaEquipamentos'
      )

      const identificadores = configData?.filter(
        (config) => config.Slug === 'familiaIdentificadores'
      )

      const rastreadores = configData?.filter(
        (config) => config.Slug === 'familiaRastreadores'
      )

      const kitsDeInsumo = configData?.filter(
        (config) => config.Slug === 'familiaKitsDeInsumo'
      )

      const kitsDeInstalacao = configData?.filter(
        (config) => config.Slug === 'familiaKitsDeInstalacao'
      )
      reset({
        Chips: {
          key: chips[0].Valor[0],
          title: chips[0].Valor[1] || 'Familia para Chips'
        },
        Equipamentos: {
          key: equipamentos[0].Valor[0],
          title: equipamentos[0].Valor[1] || 'Familia para Equipamentos'
        },
        Identificadores: {
          key: identificadores[0].Valor[0],
          title: identificadores[0].Valor[1] || 'Familia para Identificadores'
        },
        Rastreadores: {
          key: rastreadores[0].Valor[0],
          title: rastreadores[0].Valor[1] || 'Familia para Rastreadores'
        },
        KitsDeInsumo: {
          key: kitsDeInsumo[0].Valor[0],
          title: kitsDeInsumo[0].Valor[1] || 'Familia para Kits de insumo'
        },
        KitsDeInstalacao: {
          key: kitsDeInstalacao[0].Valor[0],
          title:
            kitsDeInstalacao[0].Valor[1] || 'Familia para Kits de instalação'
        }
      })
    }
  }, [configData, reset])

  return (
    <common.Card>
      <common.GenericTitle
        title="Familias para cadastros de kits"
        subtitle="Selecione a familias dos chips, equipamentos e identificadores"
        className="px-6"
      />

      <common.Separator />
      <form>
        <form.FormLine position={0} grid={3}>
          <Controller
            name="Chips"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="px-6 py-2">
                <form.SelectWithGroup
                  itens={
                    parentsFamiliesData
                      ? parentsFamiliesData.map((item) => {
                          return {
                            key: item.Id,
                            title: item.Nome,
                            children: item.Filhos?.map((filho) => {
                              return {
                                key: filho.Id,
                                title: filho.Nome,
                                children: filho.Filhos?.map((filho2) => {
                                  return {
                                    key: filho2.Id,
                                    title: filho2.Nome,
                                    children: []
                                  }
                                })
                              }
                            })
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label="Familia para Chips"
                />
                <common.OpenModalLink onClick={() => null}>
                  * Família para cadastro de chips
                </common.OpenModalLink>
              </div>
            )}
          />
          <Controller
            name="Equipamentos"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="px-6 py-2">
                <form.SelectWithGroup
                  itens={
                    parentsFamiliesData
                      ? parentsFamiliesData.map((item) => {
                          return {
                            key: item.Id,
                            title: item.Nome,
                            children: item.Filhos?.map((filho) => {
                              return {
                                key: filho.Id,
                                title: filho.Nome,
                                children: filho.Filhos?.map((filho2) => {
                                  return {
                                    key: filho2.Id,
                                    title: filho2.Nome,
                                    children: []
                                  }
                                })
                              }
                            })
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label="Familia para Equipamentos"
                />
                <common.OpenModalLink onClick={() => null}>
                  * Família para cadastro de equipamentos
                </common.OpenModalLink>
              </div>
            )}
          />
          <Controller
            name="Identificadores"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="px-6 py-2">
                <form.SelectWithGroup
                  itens={
                    parentsFamiliesData
                      ? parentsFamiliesData.map((item) => {
                          return {
                            key: item.Id,
                            title: item.Nome,
                            children: item.Filhos?.map((filho) => {
                              return {
                                key: filho.Id,
                                title: filho.Nome,
                                children: filho.Filhos?.map((filho2) => {
                                  return {
                                    key: filho2.Id,
                                    title: filho2.Nome,
                                    children: []
                                  }
                                })
                              }
                            })
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label="Familia para Identificadores"
                />
                <common.OpenModalLink onClick={() => null}>
                  * Família para cadastro de identificadores
                </common.OpenModalLink>
              </div>
            )}
          />
        </form.FormLine>
        <form.FormLine position={1} grid={3}>
          <Controller
            name="Rastreadores"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="px-6 py-2">
                <form.SelectWithGroup
                  itens={
                    parentsFamiliesData
                      ? parentsFamiliesData.map((item) => {
                          return {
                            key: item.Id,
                            title: item.Nome,
                            children: item.Filhos?.map((filho) => {
                              return {
                                key: filho.Id,
                                title: filho.Nome,
                                children: filho.Filhos?.map((filho2) => {
                                  return {
                                    key: filho2.Id,
                                    title: filho2.Nome,
                                    children: []
                                  }
                                })
                              }
                            })
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label="Familia para Rastreadores"
                />
                <common.OpenModalLink onClick={() => null}>
                  * Família para cadastro de rastreadores
                </common.OpenModalLink>
              </div>
            )}
          />
          <Controller
            name="KitsDeInsumo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="px-6 py-2">
                <form.SelectWithGroup
                  itens={
                    parentsFamiliesData
                      ? parentsFamiliesData.map((item) => {
                          return {
                            key: item.Id,
                            title: item.Nome,
                            children: item.Filhos?.map((filho) => {
                              return {
                                key: filho.Id,
                                title: filho.Nome,
                                children: filho.Filhos?.map((filho2) => {
                                  return {
                                    key: filho2.Id,
                                    title: filho2.Nome,
                                    children: []
                                  }
                                })
                              }
                            })
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label="Familia para Kits de Insumo"
                />
                <common.OpenModalLink onClick={() => null}>
                  * Família para cadastro de kits de insumo
                </common.OpenModalLink>
              </div>
            )}
          />
          <Controller
            name="KitsDeInstalacao"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="px-6 py-2">
                <form.SelectWithGroup
                  itens={
                    parentsFamiliesData
                      ? parentsFamiliesData.map((item) => {
                          return {
                            key: item.Id,
                            title: item.Nome,
                            children: item.Filhos?.map((filho) => {
                              return {
                                key: filho.Id,
                                title: filho.Nome,
                                children: filho.Filhos?.map((filho2) => {
                                  return {
                                    key: filho2.Id,
                                    title: filho2.Nome,
                                    children: []
                                  }
                                })
                              }
                            })
                          }
                        })
                      : []
                  }
                  value={value}
                  onChange={onChange}
                  label="Familia para Kits De Instalação"
                />
                <common.OpenModalLink onClick={() => null}>
                  * Família para cadastro de kits de instalação
                </common.OpenModalLink>
              </div>
            )}
          />
        </form.FormLine>
        <common.Separator />
      </form>
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <buttons.GoBackButton />
        <buttons.PrimaryButton
          title="Salvar"
          disabled={updateConfigLoading}
          onClick={handleSubmit(onSubmit)}
          loading={updateConfigLoading}
        />
      </div>
      <families.SlidePanel />
    </common.Card>
  )
}

export default Main
