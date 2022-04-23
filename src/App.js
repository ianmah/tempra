import React, { useState } from 'react'
import ApolloProvider from './components/Apollo'
import Wallet from './components/Wallet'
import Login from './components/Login'
import ThemeProvider from './components/ThemeProvider'
import GlobalStyle from './components/GlobalStyle'

function App() {
  const [wallet, setWallet] = useState({})
  const [authToken, setAuthToken] = useState(false);
  const [contract, setContract] = useState({})

  return (
    <ApolloProvider>
      <ThemeProvider>
        <GlobalStyle />
        <div className="App">
          <header className="App-header">
            <Wallet wallet={wallet} setWallet={setWallet} setLensHub={setContract} authToken={authToken} />
            <Login wallet={wallet} authToken={authToken} setAuthToken={setAuthToken} />
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
