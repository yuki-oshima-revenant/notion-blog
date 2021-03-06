
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ja">
                <Head>
                    <meta property="og:url" content="https://diary.unronritaro.net" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="Yuki Oshima's diary powered by Notion API" />
                    <meta property="og:site_name" content="Cartesian Theater" />
                    <meta name="description" content="Yuki Oshima's diary powered by Notion API"></meta>
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