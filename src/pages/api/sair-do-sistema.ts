import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

import Amplify, { Auth } from 'aws-amplify'
Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_uoK1FsO69',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '29bupks64e3kobb7tejqm2gpcb'
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false
  }
  // ssr: true
})

const handler = nc<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {
  try {
    const { user } = await Auth.signUp({
      username: 'cliente1',
      password: '123123',
      attributes: {
        email: 'jixagec982@mom2kid.com',
        'custom:empresa_id': 'rastreamento',
        'custom:franquia_id': 'goerp'
      }
    })
    return res.status(200).json(user)
  } catch (error) {
    return res.status(200).json(error)
  }
})

export const config = {
  api: {
    bodyParser: true
  }
}

export default handler
