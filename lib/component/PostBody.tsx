import { Post } from "@/lib/util/notion";
import React from "react";
import moment from 'moment';

const PostBody: React.FunctionComponent<{ post: Post }> = ({ post }) => {
    return (
        <div key={`${post.title}_content`}>
            <h2>{post.title}</h2>
            <div>{moment(post.lastEditedTs).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div className="bodyFont">
                {post.contents.map((content) => (
                    content.link
                        ? <a href={content.link} className="text-blue-600" target="_blank">{content.text}</a>
                        : <div>{content.text}</div>
                ))}
            </div>
        </div>
    )
};

export default PostBody;
