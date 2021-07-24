import { Post } from "@/lib/util/notion";
import React from "react";
import moment from 'moment';
import { useRouter } from "next/router";

const PostBody: React.FunctionComponent<{ post: Post }> = ({ post }) => {
    const router = useRouter();
    return (
        <div key={`${post.title}_content`} className="mb-12">
            <div className="mb-2">
                <h2
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => { router.push(`/post/${post.ymd}`) }}
                >{post.title}</h2>
                <div className="text-gray-500 text-sm">
                    {`Last Edited: ${moment(post.lastEditedTs).format('YYYY-MM-DD HH:mm:ss')}`}
                </div>
            </div>
            <div className="bodyFont whitespace-normal break-words">
                {post.contents.map((content, i) => (
                    content.link
                        ? (
                            <div key={i} className="leading-6 my-3">
                                <a href={content.link} className="text-gray-600 underline my-3" target="_blank">{content.text}</a>
                            </div>
                        )
                        : <div key={i} className="leading-6 my-3">{content.text}</div>
                ))}
            </div>
        </div>
    )
};

export default PostBody;
