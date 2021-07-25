import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Post, getPosts, getDatabaseData, PostIndex, getPostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';
import Head from "next/head";

export const getStaticProps: GetStaticProps<{ posts: Post[], postsIndex: PostIndex[] }> = async () => {
    const database = await getDatabaseData();
    return {
        props: {
            posts: await getPosts(database),
            postsIndex: getPostIndex(database)
        },
        revalidate: 60
    }
}

const Index = ({ posts, postsIndex }: InferGetStaticPropsType<typeof getStaticProps>) => {

    return (
        <div>
            <Head>
                <title>Cartesian Theater</title>
            </Head>
            <Layout postsIndex={postsIndex}>
                {posts.map((post) => (
                    <PostBody key={post.id} post={post} />
                ))}
            </Layout>
        </div>

    );
}
export default Index;
