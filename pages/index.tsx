import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Post, getPosts, getDatabaseData, PostIndex, getPostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';
import Head from "next/head";

export const getStaticProps: GetStaticProps<{ posts: Post[], postsIndex: PostIndex[] }> = async () => {
    const database = await getDatabaseData();
    // console.dir(database, { depth: null })
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
                <meta property="og:title" content="Cartesian Theater" />
                <meta property="og:image" content="https://diary.unronritaro.net/top.png" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:image" content="https://diary.unronritaro.net/top.png" />
            </Head>
            <Layout postsIndex={postsIndex}>
                {posts.map((post, i) => (
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
