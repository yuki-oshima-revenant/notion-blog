import { ImageResponse, NextRequest, NextResponse } from 'next/server';
import { headerImageLink } from "@/lib/util/const";

export const config = {
    runtime: 'edge',
}

async function ogp(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')
    const fontResponse = await fetch(`${process.env.APP_URL}/Inter-Bold.ttf`);
    const font = await fontResponse.arrayBuffer();
    return new ImageResponse(
        (
            <div style={{
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '52px',
            }}>
                <img
                    style={{
                        objectFit: 'cover',
                        filter: 'blur(8px)'
                    }}
                    src={headerImageLink}
                    width={1200}
                    height={630}
                    alt=""
                />
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    width: '1104px',
                    height: '534px',
                    top: '48px',
                    left: '48px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                }}>
                    <div style={{
                        display: 'flex',
                        position: 'relative',
                        margin: '236px auto',
                    }}>
                        {title && (
                            <span>
                                {`${title}`}
                            </span>
                        )}
                        <span style={{
                            margin: '0 8px'
                        }}>
                            /
                        </span>
                        <span style={{
                            letterSpacing: '-0.05em',
                        }}>
                            Cartesian Theater
                        </span>
                    </div>
                </div>
            </div >
        ),
        {
            width: 1200,
            height: 630,
            fonts: [{
                name: 'Inter',
                data: font,
                weight: 700,
                style: 'normal'
            }]
        },

    );
};

export default ogp;
