import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { posts } from '../lib/notion'

export async function getServerSideProps() {
    // Get the posts
    let { results } = await posts();
    // Return the result
    return {
        props: {
            posts: results,
            
        }
    }
}

interface Props {
    posts: [any]
}

const Home: NextPage<Props> = (props) => {
    console.log(props.posts)
    return (
        <div className={styles.container}>
        <Head>
            <title>Latest posts</title>
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
            Latest posts
            </h1>
            {
                props.posts.map((result,index) => {
                return (
                    <div className={styles.cardHolder} key={index}>
                    <Link href={`/posts/${result.id}`}>
                        <Image src={result.cover.external.url}  width={300} height={200} />
                    </Link>
                    <div className={styles.cardContent}>
                        <Link href={`/posts/${result.id}`}>
                        <a className={styles.cardTitle}>{
                        result.properties.Name.title[0].plain_text
                        }</a>
                        </Link>
                    </div>
                    </div>
                    )
                })
            }
        </main>

        <footer className={styles.footer}>
            <p>Blog application</p>
        </footer>
        </div>
    )
}

export default Home
