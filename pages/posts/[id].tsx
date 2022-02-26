import { GetStaticProps, NextPage, GetStaticPaths } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { post, posts, blocks } from '../../lib/notion';
import styles from '../../styles/Home.module.css';

interface IParams extends ParsedUrlQuery {
   id: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
   let { id } = ctx.params as IParams; 
   // Get the dynamic id
   let page_result = await post(id); 
   // Fetch the post
   let { results } = await blocks(id); 
   // Get the children
   return {
     props: {
       id,
       post: page_result,
       blocks: results
     }
   }
}
export const getStaticPaths: GetStaticPaths = async () => {
   let { results } = await posts(); 
   // Get all posts
   return {
     paths: results.map((post) => { 
       // Go through every post
       return {
         params: { 
           // set a params object with an id in it
           id: post.id
         }
       }
     }),
     fallback: false
   }
} 

interface Props {
   id: string,
   post: any,
   blocks: [any]
}

const renderBlock = (block: any) => {
   switch (block.type) {
     case 'heading_1': 
     // For a heading
       return <h1>{ block['heading_1'].text[0].plain_text } </h1> 
     case 'image': 
     // For an image
       return <Image src={ block['image'].external.url } width = { 650} height = { 400} />
       case 'bulleted_list_item': 
       // For an unordered list
       return <ul><li>{ block['bulleted_list_item'].text[0].plain_text } </li></ul >
       case 'paragraph': 
       // For a paragraph
       return <p>{ block['paragraph'].text[0]?.text?.content } </p>
     default: 
     // For an extra type
       return <p>Undefined type </p>
   }
}
    
const Post:NextPage<Props> = ({id,post,blocks}) => {
   return (
     <div className={styles.blogPageHolder}>
       <Head>
         <title>
           {post.properties.Name.title[0].plain_text}
         </title>
       </Head>
       <div className={styles.blogPageNav}>
         <nav>
           <Link href="/">
             <a>Home</a>
           </Link>
         </nav>
       </div>
       {
         blocks.map((block,index) => {
           return (
             <div key={index} className={styles.blogPageContent}>
               {
                 renderBlock(block)
               }
             </div>
           )})
       }
     </div>
   )
}

export default Post;