import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getDatabaseData, getPostIndex, getPosts, Post, PostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';
import Head from "next/head";
import { pageOffset } from '@/lib/util/const';
import moment from 'moment';

export const getStaticPaths: GetStaticPaths = async () => {
    const startMoment = moment();
    const database = await getDatabaseData(startMoment);
    const postsIndex = getPostIndex(database);

    const slicedPostIndex: PostIndex[][] = [];
    for (let i = 0; i < postsIndex.length; i += pageOffset) {
        slicedPostIndex.push(postsIndex.slice(i, i + pageOffset));
    }
    return { paths: slicedPostIndex.map((_, i) => ({ params: { pageIndex: `${i + 1}` } })), fallback: 'blocking' }
};

export const getStaticProps: GetStaticProps<{
    posts: Post[] | null,
    postsIndex: PostIndex[],
    pageIndex: string | null
}> = async ({ params, preview }) => {
    try {
        const startMoment = moment();
        const database = await getDatabaseData(startMoment);
        const posts = await getPosts(database, startMoment);
        const postsIndex = getPostIndex(database)
        const slicedPosts: Post[][] = [];
        for (let i = 0; i < posts.length; i += pageOffset) {
            slicedPosts.push(posts.slice(i, i + pageOffset));
        }
        if (params?.pageIndex && typeof params?.pageIndex === 'string') {
            return {
                props: {
                    posts: slicedPosts[parseInt(params.pageIndex, 10) - 1],
                    postsIndex,
                    pageIndex: params.pageIndex
                },
                revalidate: 60
            }
        } else {
            return {
                props: {
                    posts: null,
                    pageIndex: null,
                    postsIndex
                },
                redirect: {
                    destination: '/404'
                }
            };
        }
    } catch (e) {
        console.error(`render failed in ${params?.pageIndex}`);
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            props: {
                posts: null,
                pageIndex: null,
                postsIndex: []
            },
        };
    }
};

const Index = ({ posts, pageIndex, postsIndex }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div>
            <Head>
                <title>{`Page${pageIndex} / Cartesian Theater`}</title>
                <meta property="og:title" content={`Page${pageIndex} / Cartesian Theater`} />
                <meta property="og:image" content="https://diary.unronritaro.net/top.png" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:image" content="https://diary.unronritaro.net/top.png" />
            </Head>
            <Layout postsIndex={postsIndex} pageIndex={pageIndex}>
                {posts && posts.map((post, i) => (
                    <PostBody
                        key={post.id}
                        post={post}
                    />
                ))}
            </Layout>
        </div>

    );
}
export default Index;