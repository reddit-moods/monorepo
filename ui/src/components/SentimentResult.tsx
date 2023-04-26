import { Flex } from "@chakra-ui/react";
import { SentimentState } from "./SubredditSentimentForm";
import Image from "next/image";
import HappyEmoji from "../assets/happy.png";
import NeutralEmoji from "../assets/neutral.png";
import SadEmoji from "../assets/sad.png";
import SentimentEmoji from "./SentimentEmoji";

export default function SentimentResult({
  sentimentState,
}: {
  sentimentState: SentimentState | undefined;
}) {
  return (
    <>
      <Flex
        py={8}
        textAlign={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        {sentimentState && (
          <SentimentEmoji
            sentiment={sentimentState?.sentiment}
          ></SentimentEmoji>
        )}
        {/* TODO: change this to be reactive */}
        <Flex py={4}>
          {sentimentState && sentimentState.sentiment == "Positive" && (
            <Image src={HappyEmoji} alt="Sentiment: Happy" height={100}></Image>
          )}
          {sentimentState && sentimentState.sentiment == "Neutral" && (
            <Image src={NeutralEmoji} alt="Sentiment: Neutral" height={100}></Image>
          )}
          {sentimentState && sentimentState.sentiment == "Negative" && (
            <Image src={SadEmoji} alt="Sentiment: Sad" height={100}></Image>
          )}
        </Flex>

        {sentimentState ? (
          <>
            {/* <p>Sentiment: {sentimentState.sentiment}</p> */}
            {<p>{(100*sentimentState.confidence).toFixed(2)}% confident</p>}
          </>
        ) : (
          <>
            <p>Please submit a subreddit to get its current sentiment!</p>
          </>
        )}

      </Flex>
    </>
  );
}
