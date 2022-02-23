import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getDatabaseData, getPostIndex, getPosts, Post, PostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';
import Head from "next/head";
import moment from 'moment';

export const getStaticPaths: GetStaticPaths = async () => {
    const startMoment = moment();
    const database = await getDatabaseData(startMoment);
    const postsIndex = getPostIndex(database);
    const paths = postsIndex.map((index) => ({
        params: {
            yyyymmdd: index.ymd,
        }
    }));
    return { paths, fallback: 'blocking' }
};

export const getStaticProps: GetStaticProps<{ post: Post | null, postsIndex: PostIndex[] }> = async ({ params, preview }) => {
    try {
        const startMoment = moment();
        const database = await getDatabaseData(startMoment);
        const postsIndex = getPostIndex(database);

        const targetPostIndex = postsIndex.find((index) => index.ymd === params?.yyyymmdd);
        if (targetPostIndex) {
            const targetPost = await getPosts(database, startMoment, [targetPostIndex.id]);
            return {
                props: {
                    post: targetPost[0],
                    postsIndex
                },
                revalidate: 60,
            }

        } else {
            return {
                props: {
                    post: null,
                    postsIndex
                },
                redirect: {
                    destination: '/404'
                }
            };
        }
    } catch (e) {
        console.error(`render failed in ${params?.yyyymmdd}`);
        if (e instanceof Error) {
            console.error(e.message);
        }
        throw e;
    }

}

const Index = ({ post, postsIndex }: InferGetStaticPropsType<typeof getStaticProps>) => {
    if (!post) return <></>;

    return (
        <div>
            <Head>
                <title>{`${post.title} / Cartesian Theater`}</title>
                <meta property="og:title" content={`${post.title} / Cartesian Theater`} />
                <meta property="og:image" content={`https://diary.unronritaro.net/api/ogp?title=${encodeURIComponent(post.title)}`} />
                <meta name="twitter:image" content={`https://diary.unronritaro.net/api/ogp?title=${encodeURIComponent(post.title)}`} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Layout postsIndex={postsIndex} ymd={post.ymd}>
                <PostBody post={post} />
            </Layout>

        </div>
    )
};

export default Index;