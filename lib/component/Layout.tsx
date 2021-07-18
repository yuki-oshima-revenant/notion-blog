import { Post } from "@/lib/util/notion";

const Layout: React.FunctionComponent<{ posts: Post[] }> = ({ children, posts }) => {
    return (
        <div className="max-w-6xl mx-auto min-h-screen">
            <h1 className="font-bold text-7xl text-center my-8 tracking-tighter titleFont">Cartesian Theater</h1>
            <div className="grid grid-cols-5">
                <div className="col-span-1">
                    <div className="sticky top-8 overflow-auto">
                        {posts.map((post) => (
                            <div key={`${post.title}_index`}>
                                <div>{post.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-4">
                    {children}
                </div>
            </div>
        </div >
    )
};

export default Layout;
