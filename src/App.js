import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import LitJsSdk from 'lit-js-sdk'
import ApolloProvider from './components/Apollo'
import Wallet from './components/Wallet'
import Login from './components/Login'
import ThemeProvider from './components/ThemeProvider'
import GlobalStyle from './components/GlobalStyle'
import ProfilePicker from './components/ProfilePicker'
import Content from './components/Content'
import Sidebar from './components/Sidebar'
import Landing from './components/Landing'
import Stories from './components/Stories'

import tempra from './assets/tempra.svg'

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
  min-height: 100vh;
`

const Columns = styled.div`
  display: flex;
`

const Nav = styled.div`
  display: flex;
  gap: 8px;
`

function App() {
  const [wallet, setWallet] = useState({})
  const [authToken, setAuthToken] = useState(false);
  const [contract, setContract] = useState({})
  const [profiles, setProfiles] = useState([])
  const [convo, setConvo] = useState({})

  useEffect(() => {
      const initLit = async () => {
          const client = new LitJsSdk.LitNodeClient({
              alertWhenUnauthorized: false,
          });
          await client.connect();
          window.litNodeClient = client;
          window.authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'mumbai' });
      };
      initLit();
  }, []);

  return (
    <ApolloProvider>
      <ThemeProvider>
        <GlobalStyle/>
        {wallet.address ? <Container>
            <Nav>
              <img src={tempra} alt="tempra logos"/>
              <h2>Tempra</h2>
            </Nav>
            <Login wallet={wallet} authToken={authToken} setAuthToken={setAuthToken} setProfiles={setProfiles} />
            <Wallet wallet={wallet} setWallet={setWallet} setLensHub={setContract} authToken={authToken} setProfiles={setProfiles}/>
            <Columns>
              <div>
                <Stories profile={profiles[0]} />
                <Content convo={convo} profile={profiles[0]} wallet={wallet} lensHub={contract} />
              </div>
              <Sidebar wallet={wallet} setConvo={setConvo}>
                <ProfilePicker profiles={profiles} />
              </Sidebar>
            </Columns>
          </Container> : <Landing wallet={wallet} setWallet={setWallet} setLensHub={setContract} authToken={authToken} setProfiles={setProfiles}/>}
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
