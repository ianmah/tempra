import React, { useEffect } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'

const GET_CHALLENGE = gql`
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;

const AUTHENTICATION = gql`
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

function Login({ wallet, authToken, setAuthToken, setProfiles }) {
const [getChallenge, challengeData] = useLazyQuery(GET_CHALLENGE)
const [mutateAuth, authData] = useMutation(AUTHENTICATION)

  const handleLogin = () => {
    if (authToken) {
      console.log('login: already logged in');
      return;
  }
  
  console.log('login');

  getChallenge({ 
    variables: {
      request: {
        address: wallet.address,
      },
    },
   })
  }

  const handleLogout = () => {
      window.sessionStorage.removeItem('lensToken')
      setAuthToken(false)
      setProfiles([])
  }

  useEffect(() => {
    if (!challengeData.data) return

    const handleSign = async () => {
      const signature = await wallet.signer.signMessage(challengeData.data.challenge.text);
      mutateAuth({
        variables: {
          request: {
            address: wallet.address,
            signature,
          },
        },
      });
    }

    handleSign()
  }, [challengeData.data])

  useEffect(() => {
    if (!authData.data) return

    // window.authToken = authData.data.authenticate.accessToken
    window.sessionStorage.setItem('lensToken', authData.data.authenticate.accessToken)

    setAuthToken(true)

  }, [authData.data])

  useEffect(() => {
    if (window.sessionStorage.getItem('lensToken')) {
      setAuthToken(true)
    }
  }, [])

  return (
    <div style={{ position: 'absolute', right: '0', bottom: '0' }}>
    { authToken ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogin}>
        Login To lens
    </button> }
    </div>
    
  );
}

export default Login;
