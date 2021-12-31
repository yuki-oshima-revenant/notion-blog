import React, { useEffect, useState } from "react";
import { Content } from "@/lib/util/notion";
import Prism from 'prismjs'
import Image from 'next/image';

const PostContent: React.FunctionComponent<{ postContent: Content }> = ({
    postContent
}) => {
    useEffect(() => {
        Prism.highlightAll();
    });
    let content;
    switch (postContent.type) {
        case 'code':
            content =
                (
                    <pre className={`lang-${postContent.language} rounded-md`}>
                        <code>{postContent.text}</code>
                    </pre>
                );
            break;
        case 'heading_2':
            content = (
                <h2 className="text-xl font-medium font-sans"> {postContent.text}</h2>
            );
            break;
        case 'heading_3':
            content = (
                <h3 className="text-lg font-medium font-sans"> {postContent.text}</h3>
            );
            break;
        case 'quote':
            content = (
                <blockquote className="italic text-gray-600 px-4 border-l">
                    {postContent.text}
                </blockquote>
            );
            break;
        case 'bookmark':
            if (postContent.link) {
                content = (
                    <div className="flex md:p-2 cursor-pointer w-full"
                        onClick={() => {
                            window.open(postContent.link || '')
                        }}
                    >
                        <div className="flex-grow p-3 md:p-4 border border-r-0 w-1/2">
                            <div className="truncate h-4 text-sm">
                                {postContent.title}
                            </div>
                            <div className="text-xs mt-2 text-gray-600 line-clamp-2 md:line-clamp-3 h-8 md:h-12">
                                {postContent.description}
                            </div>
                            <div className="text-xs mt-2 truncate">
                                {postContent.link}
                            </div>
                        </div>
                        {postContent.ogpImageUrl && (
                            <img src={postContent.ogpImageUrl} className="object-cover h-[104px] md:h-32 w-1/2 md:w-60" alt={postContent.title || ''} />
                        )}
                    </div>
                );
            }
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

                break;
            }
            else {
                content = <p className="leading-6 my-3">{postContent.text}</p>;
                break;
            };
    };
    return (
        <div className="leading-6 my-4">
            {content}
        </div>
    )
};

export default PostContent;