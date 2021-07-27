import type { NextApiRequest, NextApiResponse } from "next";
import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as playwright from "playwright-aws-lambda";
// import Image from 'next/image';

const Template: React.FunctionComponent<{
    title: string, font: string;
}> = ({
    title,
    font
}) => {
        const getCss = (font: string) => `
    @font-face {
      font-family: 'Inter';
      font-weight: bold;
      src: url(data:font/ttf;charset=utf-8;base64,${font}) format('truetype');
    }
    html,
    body {
      margin: 0;
      padding: 0;
    }
    .wrapper {
      width: 1200px;
      height: 630px;
      display: flex;
      position: relative;
      align-items: center;
      font-family: 'Inter';
      font-weight: bold;
      justify-content: center;
      font-size: 52px;
    }
    .card{
        position: absolute;
        width: calc(1200px - 64px);
        height: calc(630px - 64px);
        top: 32px;
        left: 32px;
        background-color: white;
        border-radius:16px;
    }
    .titleWrap{
        display:block;
        position: relative;
        width: fit-content;
        margin: 244px auto;
    }
    .title{
        letter-spacing: -0.05em;
    }
  `;

        return (
            <html>
                <style dangerouslySetInnerHTML={{ __html: getCss(font) }} />
                <body>
                    <div className="wrapper">
                        <img
                            src="https://source.unsplash.com/peaTniZsUQs"
                            width={1200}
                            height={630}
                        // quality={100}
                        />
                        <div className="card">
                            <div className="titleWrap">
                                <span>
                                    {`${title} / `}
                                </span>
                                <span className="title">
                                    Cartesian Theater
                                </span>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        )
    };

function getHtml({ title }: { title: string }): string {
    const fontPath = path.resolve(
        process.cwd(),
        "./assets/Inter-Bold.ttf"
    );
    const font = fs.readFileSync(fontPath, { encoding: "base64" });
    const element = React.createElement(Template, { title, font });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    return `<!doctype html>${markup}`;
}

async function getLaunchOptions() {
    if (process.env.NODE_ENV !== "production") {
        return {
            args: [],
            executablePath:
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless: true,
        };
    } else {
        return {};
    }
}

const Ogp = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const title = decodeURIComponent(req.query.title as string);
        const html = getHtml({ title });

        const viewport = { width: 1200, height: 630 };
        const launchOptions = await getLaunchOptions();
        const browser = await playwright.launchChromium(launchOptions);
        const page = await browser.newPage({ viewport });

        await page.setContent(html, { waitUntil: "load" });
        await page.evaluateHandle("document.fonts.ready");

        const buffer = await page.screenshot({ type: "png" });
        await browser.close();

        // Set the s-maxage property which caches the images then on the Vercel edge
        res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
        res.setHeader("Content-Type", "image/png");

        // write the image to the response with the specified Content-Type
        res.end(buffer);
    } catch (error) {
        console.error("[Error]: ", error);
        res.status(404).json({ message: "Cannot render og-image" });
    }
};

export default Ogp;
