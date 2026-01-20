import Head from "next/head";
import Header from "@/shared/components/Header";
import LandingPage from "@/pages/LandingPage";
import { GetServerSideProps } from "next";

export default function Home() {
    return (
        <>
            <Head>
                <title>Tone — The right tone. One click.</title>
                <meta
                    name="description"
                    content="Control how you talk to clients. Tone is a browser extension that helps you reply to clients in the right tone — instantly."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>

            <Header />
            <LandingPage />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const lng = context.req.cookies.i18next || "ru";
    return {
        props: {
            lng,
        },
    };
};
