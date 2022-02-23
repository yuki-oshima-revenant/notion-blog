import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Post, getPosts, getDatabaseData, PostIndex, getPostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';
import Head from "next/head";
import { pageOffset } from '@/lib/util/const';
import moment from 'moment';

export const getStaticProps: GetStaticProps<{ posts: Post[], postsIndex: PostIndex[] }> = async () => {
    try {
        const startMoment = moment();
        const database = await getDatabaseData(startMoment);
        const posts = await getPosts(database, startMoment);
        return {
            props: {
                posts: posts.splice(0, pageOffset),
                postsIndex: getPostIndex(database)
            },
            revalidate: 60
        }
    } catch (e) {
        console.error(`render failed in /`);
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            props: {
                posts: [],
                postsIndex: []
            },
            revalidate: 60
        }
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
            <Layout postsIndex={postsIndex} pageIndex="1">
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
