import React, { useEffect } from "react";
import { Content } from "@/lib/util/notion";
import Prism from 'prismjs'

const PostContent: React.FunctionComponent<{ postContent: Content }> = ({
    postContent
}) => {
    useEffect(() => {
        Prism.highlightAll();
    });
    let content = <p className="leading-6 my-3">{postContent.text}</p>;
    switch (postContent.type) {
        case 'code':
            content =
                (
                    <pre className={`lang-${postContent.language} rounded-md`}>
                        <code>{postContent.text}</code>
                    </pre>
                );
            break;
        case 'quote':
            content = (
                <blockquote className="italic text-gray-600 px-4 border-l">
                    {postContent.text}
                </blockquote>
            );
            break;
        default:
            if (postContent.link) {
                content = (
                    <a
                        href={postContent.link}
                        className="text-gray-600 underline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {postContent.text}
                    </a>
                );
                ;
                break;
            }
    };
    return (
        <div className="leading-6 my-4">
            {content}
        </div>
    )
};

export default PostContent;