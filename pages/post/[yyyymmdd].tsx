import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getDatabaseData, getPostIndex, getPosts, Post, PostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';
import Head from "next/head";

export const getStaticPaths: GetStaticPaths = async () => {
    const database = await getDatabaseData();
    const postsIndex = getPostIndex(database);
    const paths = postsIndex.map((index) => ({
        params: {
            yyyymmdd: index.ymd,
        }
    }));
    return { paths, fallback: 'blocking' }
};

export const getStaticProps: GetStaticProps<{ post: Post | null, postsIndex: PostIndex[] }> = async ({ params, preview }) => {
    const database = await getDatabaseData();
    const postsIndex = getPostIndex(database);

    const targetPostIndex = postsIndex.find((index) => index.ymd === params?.yyyymmdd);
    if (targetPostIndex) {
        const targetPost = await getPosts(database, [targetPostIndex.id]);
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
}

const Index = ({ post, postsIndex }: InferGetStaticPropsType<typeof getStaticProps>) => {
    if (!post) return <></>;

    return (
        <div>
            <Head>
                <title>{`${post.title} / Cartesian Theater`}</title>
            </Head>
            <Layout postsIndex={postsIndex} ymd={post.ymd}>
                <PostBody post={post} />
            </Layout>

        </div>
    )
};

export default Index;