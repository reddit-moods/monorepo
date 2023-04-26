import { Flex } from "@chakra-ui/react";
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
        <NavBar></NavBar>
        <Flex w={"100%"} flexDirection="column" alignItems={"center"} my={"20"}>
          <SubredditSentimentForm></SubredditSentimentForm>
        </Flex>
      </main>
    </>
  );
}
