import { Post } from "@/lib/util/notion";
import React from "react";
import moment from 'moment';
import { useRouter } from "next/router";
import PostContent from '@/lib/component/PostContent';
const PostBody: React.FunctionComponent<{
    post: Post,
}> = ({
    post,
}) => {
        const router = useRouter();
        return (
            <div key={`${post.title}_content`} className={"mb-12"}>
                <div className="mb-2">
                    <h2
                        className="text-2xl font-bold cursor-pointer tracking-tight"
                        onClick={() => { router.push(`/post/${post.ymd}`) }}
                    >{post.title}</h2>
                    <div className="text-gray-500 text-sm my-1">
                        <div>
                            {`Date: ${post.date}`}
                        </div>
                        <div>
                            {`Last Edited: ${moment(post.lastEditedTs).format('YYYY-MM-DD HH:mm:ss')}`}
                        </div>
                    </div>
                </div>
                <div className="bodyFont whitespace-normal break-words">
                    {post.contents.map((content, i) => (
                        <PostContent postContent={content} key={i} />
                    ))}
                </div>
            </div>
        )
    };

export default PostBody;
