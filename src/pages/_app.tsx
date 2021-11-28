import '../styles/globals.css'
import Head from 'next/head'
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '../styles/createEmotionCache'
import { EnhancedAppProps } from '../types'
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

function App({ Component, emotionCache = clientSideEmotionCache, pageProps }: EnhancedAppProps) {
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>LoL Mastery Chest Viewer</title>
                <meta content="width=device-width, initial-scale=1" name="viewport" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </CacheProvider>
    )
}

export default App
