import { Children as ReactChildren } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import theme from '../styles/theme'
import createEmotionCache from '../styles/createEmotionCache'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta content="#ffffff" name="msapplication-TileColor" />
                    <meta content={theme.palette.primary.main} name="theme-color" />
                    <meta
                        content="Web site that lets you check the mastery chest's availability on champions of given EUNE League of Legends Summoner."
                        name="description"
                    />
                    <link href="/favicon.ico" rel="icon" />
                    <link href="/manifest.json" rel="manifest" />
                    <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
                    <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
                    <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                    <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                    <link href="/site.webmanifest" rel="manifest" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhancedApp(props) {
                    // @ts-expect-error
                    return <App emotionCache={cache} {...props} />
                },
        })

    const initialProps = await Document.getInitialProps(ctx)
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            dangerouslySetInnerHTML={{ __html: style.css }}
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
        />
    ))

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...ReactChildren.toArray(initialProps.styles), ...emotionStyleTags],
    }
}
