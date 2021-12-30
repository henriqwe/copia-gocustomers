import Amplify from 'aws-amplify'

// TODO Configurar pprojeto do ampplify
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_uoK1FsO69',
    userPoolWebClientId: '29bupks64e3kobb7tejqm2gpcb'
  }
})

export default Amplify
