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
            "Seamlessly analyze the current sentiment/mood of a subreddit.",
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
        <Flex flexDir={"column"} bg={"gray.100"} minH={"100vh"}>
          <NavBar></NavBar>

          <Box
            py={["20%", "5%"]}
            px={["8%", "5%"]}
            my={20}
            mx={["5%", "15%"]}
            bg={"white"}
            rounded={"xl"}
          >
            <Flex w={"100%"} flexDir={"column"}>
              <SubredditSentimentForm></SubredditSentimentForm>
            </Flex>
          </Box>
        </Flex>
      </main>
    </>
  );
}
