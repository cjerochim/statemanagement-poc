import Head from "next/head";
import styles from "@/styles/Home.module.css";
import useStore from "@/features/counter/store";
import Link from "next/link";

export default function Home() {
  const { count1, count2, send1, send2 } = useStore(
    ({ counter, counter2 }) => ({
      count1: counter.state.context.count,
      count2: counter2.state.context.count,
      send1: counter.send,
      send2: counter2.send,
    })
  );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>
          Hello {count1} {count2}
        </h1>
        <Link href="/blog">Blog</Link>
        <button onClick={() => send1("INCREMENT")}>Increment 1</button>
        <button onClick={() => send1("DECREMENT")}>Decrement 1</button>
        <button onClick={() => send2("INCREMENT")}>Increment 2</button>
        <button onClick={() => send2("DECREMENT")}>Decrement 2</button>
      </main>
    </>
  );
}
