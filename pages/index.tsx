import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Post, getPosts, getDatabaseData, PostIndex, getPostIndex } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';

export const getStaticProps: GetStaticProps<{ posts: Post[], postsIndex: PostIndex[] }> = async () => {
    const database = await getDatabaseData();
    return {
        props: {
            posts: await getPosts(database),
            postsIndex: getPostIndex(database)
        }
    }
}

const Index = ({ posts, postsIndex }: InferGetStaticPropsType<typeof getStaticProps>) => {

    return (
        <div>
            <Layout postsIndex={postsIndex}>
                {posts.map((post) => (
                    <PostBody key={post.id} post={post} />
                ))}
            </Layout>
        </div>

    );
}
export default Index;
