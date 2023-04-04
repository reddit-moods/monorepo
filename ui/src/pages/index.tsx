import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@redditmoods/styles/Home.module.css";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import HookForm from "./HookForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HookForm></HookForm>
      </main>
    </>
  );
}
