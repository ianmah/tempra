import React from 'react'
import { ThemeProvider } from 'styled-components'

const theme = {
    primary: '#7329F0',
    font: `'General Sans', sans-serif`,
}


export default ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>