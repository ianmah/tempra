import React, { useState } from 'react'
import styled from 'styled-components'
import ApolloProvider from './components/Apollo'
import Wallet from './components/Wallet'
import Login from './components/Login'
import ThemeProvider from './components/ThemeProvider'
import GlobalStyle from './components/GlobalStyle'
import ProfilePicker from './components/ProfilePicker'
import Content from './components/Content'
import Sidebar from './components/Sidebar'

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  min-height: 100vh;
`

const Columns = styled.div`
  display: flex;

`

function App() {
  const [wallet, setWallet] = useState({})
  const [authToken, setAuthToken] = useState(false);
  const [contract, setContract] = useState({})
  const [profiles, setProfiles] = useState([])
  const [convo, setConvo] = useState({})

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
            <Login wallet={wallet} authToken={authToken} setAuthToken={setAuthToken} setProfiles={setProfiles} />
            <div>
              <h1>Tempra</h1>
              <ProfilePicker profiles={profiles} />
            </div>
            <Columns>
              <Content convo={convo} profile={profiles[0]} wallet={wallet} lensHub={contract} />
              <Sidebar wallet={wallet} setConvo={setConvo} />
            </Columns>
          </Container>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
