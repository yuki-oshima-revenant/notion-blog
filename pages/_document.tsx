
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ja">
                <Head>
                    <meta property="og:url" content="https://diary.unronritaro.net" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Cartesian Theater" />
                    {/* <meta property="og:image" content="https://source.unsplash.com/peaTniZsUQs" /> */}
                    <meta property="og:site_name" content="Cartesian Theater" />
                    <meta name="twitter:card" content="summary" />
                    {/* <meta name="twitter:image" content="https://source.unsplash.com/peaTniZsUQs" /> */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
};

export default MyDocument;