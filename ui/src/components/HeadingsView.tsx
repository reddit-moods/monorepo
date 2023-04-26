import {
  Card,
  CardBody,
  Flex,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ModelPrediction } from "./SubredditSentimentForm";

interface HeadingsPredictionPair {
  heading: string;
  prediction: ModelPrediction;
}
// Separates each pair into one of 3 buckets: positive, neutral, negative
function separateBySentiment(pairs: HeadingsPredictionPair[]) {
  const positive: HeadingsPredictionPair[] = [];
  const neutral: HeadingsPredictionPair[] = [];
  const negative: HeadingsPredictionPair[] = [];

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    switch (pair.prediction.label) {
      case "LABEL_0":
        negative.push(pair);
        break;

      case "LABEL_1":
        neutral.push(pair);
        break;

      case "LABEL_2":
        positive.push(pair);
        break;

      default:
        break;
    }
  }

  // Sort in descending order
  positive.sort(
    (pair1, pair2) => pair2.prediction.score - pair1.prediction.score
  );

  neutral.sort(
    (pair1, pair2) => pair2.prediction.score - pair1.prediction.score
  );

  negative.sort(
    (pair1, pair2) => pair2.prediction.score - pair1.prediction.score
  );

  return {
    positive,
    neutral,
    negative,
  };
}

function SentimentSection({
  sentimentHeader,
  pairs,
}: {
  sentimentHeader: string;
  pairs: HeadingsPredictionPair[];
}) {
  return (
    <>
      <Flex flexDir={"column"} gap={4} w={"100%"}>
        <Stack direction={"row"} justifyContent={"center"}>
          <Text
            as="span"
            fontSize={"lg"}
            fontWeight={"bold"}
            textAlign={"center"}
            display={"inline"}
          >
            {pairs.length}/25 posts were
          </Text>
          <Text
            as="span"
            fontSize={"lg"}
            fontWeight={"bold"}
            textAlign={"center"}
            color={"primary.500"}
          >
            {sentimentHeader}
          </Text>
        </Stack>
        <Card h={"100%"} borderWidth={"thin"}>
          <CardBody>
            <Flex flexDir={"column"}>
              <Flex
                flexDir={"row"}
                gap={4}
                justifyContent={"space-between"}
                mb={2}
              >
                <Text fontWeight={"bold"}>Post Title</Text>
                <Text fontWeight={"bold"}>AI Confidence</Text>
              </Flex>
              {pairs.map(({ heading, prediction }) => {
                return (
                  <>
                    <Flex
                      flexDir={"row"}
                      gap={4}
                      justifyContent={"space-between"}
                    >
                      <Text>{heading}</Text>
                      <Text>{(100 * prediction.score).toFixed(2)}%</Text>
                    </Flex>
                  </>
                );
              })}
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}

export default function HeadingsView({
  headings,
  predictions,
  subreddit,
}: {
  headings: string[];
  predictions: ModelPrediction[];
  subreddit: string;
}) {
  const headingsAndPred = headings.map(function (heading: string, i: number) {
    return {
      heading,
      prediction: predictions[i],
    };
  });

  const { positive, neutral, negative } = separateBySentiment(headingsAndPred);

  return (
    <>
      {/* Render three separate scrollable cards for positive/neutral/negative */}
      {/* <Flex flexDir={"row"} gap={4} w={"100%"} justifyContent={"center"}> */}
      <Text
        fontSize={"lg"}
        fontWeight={"bold"}
        textAlign={"center"}
        decoration={"underline"}
        textDecorationColor={"primary.400"}
      >
        Moods of Hottest Posts on r/{subreddit}
      </Text>
      <SimpleGrid row={3} gap={4} w={"100%"} my={4}>
        <SentimentSection
          sentimentHeader={"positive"}
          pairs={positive}
        ></SentimentSection>
        <SentimentSection
          sentimentHeader={"neutral"}
          pairs={neutral}
        ></SentimentSection>
        <SentimentSection
          sentimentHeader={"negative"}
          pairs={negative}
        ></SentimentSection>
      </SimpleGrid>
      {/* </Flex> */}
    </>
  );
}
