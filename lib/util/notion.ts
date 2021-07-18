import { Client } from '@notionhq/client';

export type Post = {
    title: string,
    createdTs: string,
    lastEditedTs: string,
    contents: {
        // やる気が出たら追加
        type: 'paragraph',
        text: string | null,
        link: string | null,
    }[]
}

const notion = new Client({
    auth: process.env.NOTION_SECRET,
});

export const getPosts = async () => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID || '',
        filter: {
            or: [
                {
                    property: 'published',
                    checkbox: {
                        equals: true,
                    },
                },
            ]
        }
    });
    const posts: Post[] = [];
    for (const result of response.results) {
        const postProperties = await notion.pages.retrieve({ page_id: result.id });
        // console.dir(postProperties, { depth: null });
        const post: Post = {
            // @ts-ignore
            title: postProperties.properties.post.title[0].text.content,
            createdTs: postProperties.created_time,
            lastEditedTs: postProperties.last_edited_time,
            contents: []
        }

        const postContent = await notion.blocks.children.list({ block_id: result.id });
        // console.dir(postContent, { depth: null });
        postContent.results.forEach((result) => {
            switch (result.type) {
                case 'paragraph': post.contents.push({
                    type: result.type,
                    // @ts-ignore
                    text: result['paragraph'].text[0]?.text.content || null,
                    // @ts-ignore
                    link: result['paragraph'].text[0]?.text.link?.url || null
                });
                    break;
            }
        });
        posts.push(post);
    }
    return posts;
}