import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Post, getPosts } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';

export const getStaticProps: GetStaticProps<{ posts: Post[] }> = async () => {
    const posts = await getPosts();
    return {
        props: {
            posts
        }
    }
}

const Index = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {

    return (
        <Layout posts={posts}>
            {posts.map((post) => (
                <PostBody post={post} />
            ))}
        </Layout>
    );
}
export default Index;
