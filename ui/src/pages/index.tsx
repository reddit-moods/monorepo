import { Box, Flex } from "@chakra-ui/react";
import SubredditSentimentForm from "../components/SubredditSentimentForm";
import { NextSeo } from "next-seo";
import NavBar from "@redditmoods/components/Nav";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Reddit Moods | Subreddit Sentiment Analysis"
        description="Seamlessly analyze the current sentiment of a subreddit."
        openGraph={{
          url: "https://reddit-moods-ui.vercel.app/",
          title: "Reddit Moods | Subreddit Sentiment Analysis",
          description:
            "Seamlessly analyze the current sentiment of a subreddit.",
          images: [
            {
              url: "https://www.redditinc.com/assets/images/site/reddit-logo.png",
              width: 800,
              height: 600,
              alt: "Reddit Moods Image",
              type: "image/png",
            },
          ],
          siteName: "Reddit Moods",
        }}
      />
      <main>
        <Flex flexDir={"column"} bg={"gray.100"} h={"100vh"}>
          <NavBar></NavBar>
          <Box py={10} px={10} my={20} mx={96} bg={"white"} rounded={"lg"}>
            <SubredditSentimentForm></SubredditSentimentForm>
          </Box>
        </Flex>
      </main>
    </>
  );
}
