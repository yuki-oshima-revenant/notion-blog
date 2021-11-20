import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

export type PostIndex = {
    id: string,
    ymd: string,
    year: string,
    month: string,
    date: string,
}

export type Content = {
    type: 'paragraph' | 'quote',
    text: string | null,
    link: string | null,
} | {
    type: 'code',
    text: string | null,
    link: string | null,
    language: string | null
}


export type Post = {
    id: string,
    title: string,
    date: string,
    ymd: string,
    createdTs: string,
    lastEditedTs: string,
    contents: Content[]
}

const notion = new Client({
    auth: process.env.NOTION_SECRET,
});

export const getDatabaseData = async (
    // startCursor?: string, pageSize?: number
) => {
    return notion.databases.query({
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
        },
        sorts: [
            {
                property: 'date',
                direction: 'descending',
            },
        ],
        // start_cursor: startCursor,
        // page_size: pageSize
    });
};


export const getPosts = async (databaseResponse: QueryDatabaseResponse, ids?: string[]) => {
    const postContentPromises = [];
    if (ids) {
        ids.forEach(id => {
            postContentPromises.push(notion.blocks.children.list({ block_id: id }));
        });
    } else {
        for (const result of databaseResponse.results) {
            postContentPromises.push(notion.blocks.children.list({ block_id: result.id }));
        }
    }
    const postContents = await Promise.all(postContentPromises);
    const posts: Post[] = postContents.map((postContent, i) => {
        const page = ids ? databaseResponse.results.find((result) => result.id === ids[i]) : databaseResponse.results[i];
        // @ts-ignore
        const date: string = page.properties.date.date.start;
        const post: Post = {
            id: page?.id || '',
            // @ts-ignore
            title: page?.properties.post.title[0].plain_text,
            date,
            ymd: date.replace(/-/g, ''),
            createdTs: page?.created_time || '',
            lastEditedTs: page?.last_edited_time || '',
            contents: []
        }
        postContent.results.forEach((result) => {
            switch (result.type) {
                case 'paragraph': post.contents.push({
                    type: result.type,
                    text: result['paragraph'].text[0]?.plain_text || null,
                    link: result['paragraph'].text[0]?.href || null,
                });
                    break;
                case 'quote': post.contents.push({
                    type: result.type,
                    text: result['quote'].text[0]?.plain_text || null,
                    link: result['quote'].text[0]?.href || null,
                });
                    break;
                case 'code': post.contents.push({
                    type: result.type,
                    text: result['code'].text[0]?.plain_text || null,
                    link: result['code'].text[0]?.href || null,
                    language: result['code'].language || null,
                });
                    break;
            }
        });
        return post;
    });
    return posts;
}

export const getPostIndex = (response: QueryDatabaseResponse) => {
    const postIndex: PostIndex[] = response.results.map((result) => {
        // @ts-ignore
        const ymd = (result.properties.date.date.start as string).replace(/-/g, '');
        return {
            id: result.id,
            // @ts-ignore
            title: result.properties.post.title[0].text.content as string,
            ymd,
            year: ymd.substring(0, 4),
            month: ymd.substring(4, 6),
            date: ymd.substring(6, 8),
        }
    });
    return postIndex;
};
