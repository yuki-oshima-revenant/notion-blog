import { Client } from '@notionhq/client';
import { DatabasesQueryResponse } from '@notionhq/client/build/src/api-endpoints';
import moment from 'moment';

export type PostIndex = {
    id: string,
    ymd: string,
    year: string,
    month: string,
    date: string,
}

export type Post = {
    id: string,
    title: string,
    date: string,
    ymd: string,
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

export const getDatabaseData = async () => {
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
        ]
    });
};


export const getPosts = async (response: DatabasesQueryResponse, ids?: string[]) => {
    const postContentPromises = [];
    if (ids) {
        ids.forEach(id => {
            postContentPromises.push(notion.blocks.children.list({ block_id: id }));
        });
    } else {
        for (const result of response.results) {
            postContentPromises.push(notion.blocks.children.list({ block_id: result.id }));
        }
    }
    const postContents = await Promise.all(postContentPromises);
    const posts: Post[] = postContents.map((postContent, i) => {
        const page = response.results[i];
        // @ts-ignore
        const date: string = page.properties.date.date.start;
        const post: Post = {
            id: page.id,
            // @ts-ignore
            title: page.properties.post.title[0].text.content,
            date,
            ymd: date.replace(/-/g, ''),
            createdTs: page.created_time,
            lastEditedTs: page.last_edited_time,
            contents: []
        }
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
        return post;
    });
    return posts
}

export const getPostIndex = (response: DatabasesQueryResponse) => {
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
