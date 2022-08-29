import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import LoteryEntrance from '../components/LoteryEntrance';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lotery</title>
                <meta name="description" content="Our Smart Contract Lotery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {/* <ManualHeader /> */}
            <Header />
            <LoteryEntrance />
        </div>
    );
}
