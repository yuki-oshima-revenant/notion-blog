import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import jsdom from 'jsdom';
import moment, { Moment } from 'moment';
const { JSDOM } = jsdom;

export type PostIndex = {
    id: string,
    ymd: string,
    year: string,
    month: string,
    date: string,
}

export type Content = {
    type: 'paragraph' | 'quote' | 'heading_2' | 'heading_3',
    text: string | null,
    link: string | null,
} | {
    type: 'code',
    text: string | null,
    link: string | null,
    language: string | null
} | {
    type: 'bookmark',
    link: string | null,
    title: string | null,
    description: string | null,
    ogpImageUrl: string | null,
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

async function timeout(msec: number) {
    return new Promise((_, reject) => setTimeout(reject, msec))
}

const notion = new Client({
    auth: process.env.NOTION_SECRET,
});

export const getDatabaseData = async (
    // startCursor?: string, pageSize?: number
    startMoment: Moment,
) => {
    const database = await notion.databases.query({
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
    console.log(`getDatabaseData finished in ${moment().diff(startMoment)}ms`);
    return database;
};


export const getPosts = async (databaseResponse: QueryDatabaseResponse, startMoment: Moment, ids?: string[]) => {
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
                case 'heading_2': post.contents.push({
                    type: result.type,
                    text: result['heading_2'].text[0]?.plain_text || null,
                    link: result['heading_2'].text[0]?.href || null,
                });
                    break;
                case 'heading_3': post.contents.push({
                    type: result.type,
                    text: result['heading_3'].text[0]?.plain_text || null,
                    link: result['heading_3'].text[0]?.href || null,
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
                case 'bookmark':
                    const link = result['bookmark'].url;
                    let title = null;
                    let description = null;
                    let ogpImageUrl = null

                    post.contents.push({
                        type: result.type,
                        link,
                        title,
                        description,
                        ogpImageUrl
                    });
                    break;
            }
        });
        return post;
    });
    console.log(`getPostContents finished in ${moment().diff(startMoment)}ms / ids:${ids}`);
    const getOgpPromises = []
    for (const post of posts) {
        for (const content of post.contents) {
            if (content.type === 'bookmark' && content.link) {
                const promise = fetch(content.link, { redirect: 'follow' }).then((res) => res.text()).then((text) => {
                    const { document } = new JSDOM(text).window;
                    const metatags = Array.from(document.getElementsByTagName('meta'));
                    metatags.forEach((meta) => {
                        const property = meta.getAttribute('property') || meta.getAttribute('name');
                        switch (property) {
                            case 'og:title' || 'twitter:title': {
                                if (content.title) break;
                                content.title = meta.getAttribute('content'); break;
                            }
                            case 'og:description' || 'twitter:description' || 'description': {
                                if (content.description) break;
                                content.description = meta.getAttribute('content'); break;
                            }
                            case 'og:image' || 'twitter:image': {
                                if (content.ogpImageUrl) break;
                                content.ogpImageUrl = meta.getAttribute('content'); break;
                            }
                        }
                    });
                    if (!content.title || content.title.length === 0) {
                        content.title = document.getElementsByTagName('title')[0]?.innerText || null;
                    }
                });
                getOgpPromises.push(Promise.race([promise, timeout(8000 - moment().diff(startMoment))]));
            }
        }
    }
    try {
        await Promise.all(getOgpPromises);
    } catch {

    }
    console.log(`getPostOGPs finished in ${moment().diff(startMoment)}ms / ids:${ids}`);

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
