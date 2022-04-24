import React from 'react'
import { ThemeProvider } from 'styled-components'

const theme = {
    primary: '#2561ED',
    primaryHover: 'rgba(255, 199, 73, 0.35)',
    gradient: 'linear-gradient(189.15deg, #F6C005 0.58%, #F87383 49.27%, #726FFF 100%)',
    font: `'General Sans', sans-serif`,
}


export default ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>