import { Client } from '@notionhq/client';

const client = new Client({
    auth: process.env.NOTION_KEY,
});

async function posts() {
    const myPosts = await client.databases.query({
        database_id: `${process.env.NOTION_DATABASE}`,
    });
    return myPosts;
}

async function post(id: string) {
    const myPost = await client.pages.retrieve({
        page_id: id,
    });
    return myPost;
}

async function blocks(id: string) {
    const myBlocks = await client.blocks.children.list({
        block_id: id
    });
    return myBlocks;
}


export {
    posts,
    post,
    blocks
}