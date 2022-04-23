import React, { useState } from 'react'
import styled from 'styled-components'
import ApolloProvider from './components/Apollo'
import Wallet from './components/Wallet'
import Login from './components/Login'
import ThemeProvider from './components/ThemeProvider'
import GlobalStyle from './components/GlobalStyle'
import ProfilePicker from './components/ProfilePicker'

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  background: #fafafa;
  min-height: 100vh;
`

function App() {
  const [wallet, setWallet] = useState({})
  const [authToken, setAuthToken] = useState(false);
  const [contract, setContract] = useState({})
  const [profiles, setProfiles] = useState([])

  return (
    <ApolloProvider>
      <ThemeProvider>
        <GlobalStyle/>
          <Container>
            <Wallet
              wallet={wallet}
              setWallet={setWallet}
              setLensHub={setContract}
              authToken={authToken}
              setProfiles={setProfiles}
              />
            <Login wallet={wallet} authToken={authToken} setAuthToken={setAuthToken} />
            <h1>Tempra</h1>
            <ProfilePicker profiles={profiles} />
          </Container>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
