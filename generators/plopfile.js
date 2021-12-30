module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Criar componente',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Qual nome para o componente você deseja?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../src/components/_generated/{{pascalCase name}}/index.tsx',
        templateFile: 'templates/Component.tsx.hbs'
      },
      {
        type: 'add',
        path: '../src/components/_generated/{{pascalCase name}}/stories.tsx',
        templateFile: 'templates/stories.tsx.hbs'
      },
      {
        type: 'add',
        path: '../src/components/_generated/{{pascalCase name}}/test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      }
    ]
  })
}
