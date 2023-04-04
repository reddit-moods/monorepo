import SubredditSentimentForm from "./SubredditSentimentForm";
import { NextSeo } from "next-seo";

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
              alt: "Og Image Alt",
              type: "image/png",
            },
          ],
          siteName: "Reddit Moods",
        }}
      />
      <main>
        <SubredditSentimentForm></SubredditSentimentForm>
      </main>
    </>
  );
}
