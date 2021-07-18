import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPosts, Post } from '@/lib/util/notion';
import PostBody from '@/lib/component/PostBody';
import Layout from '@/lib/component/Layout';

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getPosts();

    const paths = posts.map((post) => ({
        params: {
            yyyymmdd: post.title || undefined,
        }
    }));
    return { paths, fallback: 'blocking' }
};

export const getStaticProps: GetStaticProps<{ post: Post | null, posts: Post[] }> = async ({ params, preview }) => {
    const posts = await getPosts();

    const notFoundResponse = {
        props: {
            post: null,
            posts
        },
        redirect: {
            destination: '/404'
        }
    };
    if (!params?.yyyymmdd || Array.isArray(params.yyyymmdd)) {
        return notFoundResponse;
    }
    const targetPost = posts.find((post) => post.title === params.yyyymmdd);
    if (targetPost) {
        return {
            props: {
                post: targetPost,
                posts
            },
            revalidate: 60,
        }
    } else {
        return notFoundResponse;
    }

}

const Index = ({ post, posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
    if (!post) return <></>;

    return (
        <Layout posts={posts}>
            <PostBody post={post} />
        </Layout>
    )
};

export default Index;