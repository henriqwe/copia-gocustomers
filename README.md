Este é o GoERP - ERP da Comigo Rastreamento

## Informações gerais
---
- Foi utilizada na interface o tema Rubick do Midone.
    * Boas práticas
        - Não alterar arquivos do tema Rubick
        - Sobrescrever no app.scss
- Comandos:
  * yarn lint
  * yarn test [-watch]
  * yarn generate
  * yarn storybook
  * yarn build-storybook
  * yarn client:generate:schema

### Estrutura de arquivos
---
Componentes:
- src/compoenents/compoenents - Componentes únicos
- src/compoenents/blocos - Componentes que se utilizam de outros
- src/compoenents/templates - Componentes usados no root das páginas
- src/compoenents/dominios - Componentes usados no root das páginas
---
Estrutura de componentes:
- NomeDoComponenteNaPasta
    * Conteúdo da pasta
        - index.tsx
        - stories.tsx (somente para componentes compartilhados e blocos)
        - test.tsx
---
Domínios
- src/modules/domínios - Componentes com lógica
---
Páginas:
- src/pages.
    * Empresas:
        - src/pages/rastreamento.
        - src/pages/assistencia.
        - src/pages/maxline.
---
Guia de estilo:
- Autalizar sempre que definir novo ponto!!!
- Utilizar sempre caminho completo nos imports
- Inserir TODO's e FIXME's no código.
- Fazer uso de comentários quando necessário
- Componentes, páginas e templates em PT-BR
- Código em pt-br
- Fazer uso de errors boundaries
- Palavras que não serão traduzidas
    * Context, Provider, Breadcrumb, o "use" dos hooks criados
    * Handler para ações de callback
---
Padronização de commits:
- Mensagens dos commits em pt-br
- Quando for merge
    * Grupo: merge
    * Mensagem: merge commit
- Grupos
    * backend
    * frontend
- Normalização do banco de dados
    * esquemas:
        - minusculo
    * tabelas e colunas:
        - CamelCase
    * Relacionamentos
        - Utilizar _ para indicar quando for relacionamento, exemplo: Usuario_Id
